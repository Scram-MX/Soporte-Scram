import axios from 'axios';

// Configuración hardcodeada como fallback - Producción SCRAM
const FALLBACK_CONFIG = {
  glpiUrl: import.meta.env.VITE_GLPI_URL || 'https://glpi.scram2k.com',
  appToken: import.meta.env.VITE_GLPI_APP_TOKEN || '',
  userToken: import.meta.env.VITE_GLPI_USER_TOKEN || '',
};

// Obtener configuración (runtime o fallback)
const getConfig = () => {
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG) {
    return {
      glpiUrl: window.RUNTIME_CONFIG.GLPI_URL || FALLBACK_CONFIG.glpiUrl,
      appToken: window.RUNTIME_CONFIG.GLPI_APP_TOKEN || FALLBACK_CONFIG.appToken,
      userToken: window.RUNTIME_CONFIG.GLPI_USER_TOKEN || FALLBACK_CONFIG.userToken,
    };
  }
  return FALLBACK_CONFIG;
};

const API_PATH = '/api.php/v1';

class GlpiApiService {
  constructor() {
    const config = getConfig();
    this.baseUrl = `${config.glpiUrl}${API_PATH}`;
    this.sessionToken = null;
    this.userToken = config.userToken;
    this.appToken = config.appToken;

    console.log('GLPI API Config:', {
      baseUrl: this.baseUrl,
      appToken: this.appToken ? 'SET' : 'NOT SET'
    });

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((reqConfig) => {
      const currentConfig = getConfig();
      if (currentConfig.appToken) {
        reqConfig.headers['App-Token'] = currentConfig.appToken;
      }
      if (this.sessionToken) {
        reqConfig.headers['Session-Token'] = this.sessionToken;
      }
      return reqConfig;
    });
  }

  async initSession(username, password) {
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await this.api.get('/initSession', {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
      this.sessionToken = response.data.session_token;
      localStorage.setItem('glpi_session_token', this.sessionToken);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async initSessionWithToken(userToken) {
    try {
      const response = await this.api.get('/initSession', {
        headers: {
          Authorization: `user_token ${userToken}`,
        },
      });
      this.sessionToken = response.data.session_token;
      localStorage.setItem('glpi_session_token', this.sessionToken);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async killSession() {
    try {
      await this.api.get('/killSession');
      this.sessionToken = null;
      localStorage.removeItem('glpi_session_token');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  restoreSession() {
    const token = localStorage.getItem('glpi_session_token');
    if (token) {
      this.sessionToken = token;
      return true;
    }
    return false;
  }

  hasUserToken() {
    return !!this.userToken;
  }

  async autoLoginWithUserToken() {
    if (!this.userToken) {
      throw new Error('No hay User Token configurado');
    }
    return this.initSessionWithToken(this.userToken);
  }

  async getFullSession() {
    try {
      const response = await this.api.get('/getFullSession');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyProfiles() {
    try {
      const response = await this.api.get('/getMyProfiles');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getItems(itemtype, params = {}) {
    try {
      const response = await this.api.get(`/${itemtype}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getItem(itemtype, id, params = {}) {
    try {
      const response = await this.api.get(`/${itemtype}/${id}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createItem(itemtype, data) {
    try {
      const response = await this.api.post(`/${itemtype}`, { input: data });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateItem(itemtype, id, data) {
    try {
      const response = await this.api.put(`/${itemtype}/${id}`, { input: data });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteItem(itemtype, id, params = {}) {
    try {
      const response = await this.api.delete(`/${itemtype}/${id}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async search(itemtype, criteria = [], params = {}) {
    try {
      const searchParams = { ...params };
      criteria.forEach((criterion, index) => {
        Object.keys(criterion).forEach((key) => {
          searchParams[`criteria[${index}][${key}]`] = criterion[key];
        });
      });
      const response = await this.api.get(`/search/${itemtype}`, { params: searchParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTickets(params = {}) {
    return this.getItems('Ticket', {
      expand_dropdowns: true,
      ...params,
    });
  }

  async getTicket(id) {
    return this.getItem('Ticket', id, {
      expand_dropdowns: true,
      with_logs: true,
    });
  }

  async getTicketSLA(ticketId) {
    try {
      const ticket = await this.getTicket(ticketId);
      const slaInfo = {
        tto: {
          sla_id: ticket.slas_id_tto,
          target_date: ticket.time_to_own,
          status: this.calculateSLAStatus(ticket.time_to_own, ticket.takeintoaccount_delay_stat),
        },
        ttr: {
          sla_id: ticket.slas_id_ttr,
          target_date: ticket.time_to_resolve,
          status: this.calculateSLAStatus(ticket.time_to_resolve, ticket.solve_delay_stat),
        },
        stats: {
          takeinto_delay: ticket.takeintoaccount_delay_stat,
          solve_delay: ticket.solve_delay_stat,
          waiting_duration: ticket.waiting_duration,
          close_delay: ticket.close_delay_stat,
        },
        dates: {
          created: ticket.date,
          modified: ticket.date_mod,
          solved: ticket.solvedate,
          closed: ticket.closedate,
          due: ticket.time_to_resolve,
        },
        status: ticket.status,
        urgency: ticket.urgency,
        priority: ticket.priority,
        impact: ticket.impact,
      };
      return slaInfo;
    } catch (error) {
      console.error('Error obteniendo SLA:', error);
      return null;
    }
  }

  calculateSLAStatus(targetDate, actualDelay) {
    if (!targetDate) return { status: 'none', label: 'Sin SLA', color: 'gray' };

    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now;
    const diffMinutes = diffMs / (1000 * 60);
    const diffHours = diffMinutes / 60;

    if (actualDelay !== null && actualDelay !== undefined) {
      const targetMinutes = (target - new Date(target).setHours(0,0,0,0)) / (1000 * 60);
      if (actualDelay <= targetMinutes || diffMs >= 0) {
        return { status: 'met', label: 'Cumplido', color: 'success' };
      } else {
        return { status: 'breached', label: 'Vencido', color: 'danger' };
      }
    }

    if (diffMs < 0) {
      return { status: 'breached', label: 'Vencido', color: 'danger', overdue: true };
    } else if (diffHours <= 1) {
      return { status: 'critical', label: 'Crítico', color: 'danger', remaining: diffMinutes };
    } else if (diffHours <= 4) {
      return { status: 'warning', label: 'En riesgo', color: 'warning', remaining: diffMinutes };
    } else {
      return { status: 'ok', label: 'En tiempo', color: 'success', remaining: diffMinutes };
    }
  }

  formatTimeRemaining(minutes) {
    if (minutes < 0) {
      const absMinutes = Math.abs(minutes);
      if (absMinutes < 60) return `Vencido hace ${Math.round(absMinutes)} min`;
      if (absMinutes < 1440) return `Vencido hace ${Math.round(absMinutes / 60)} hrs`;
      return `Vencido hace ${Math.round(absMinutes / 1440)} días`;
    }
    if (minutes < 60) return `${Math.round(minutes)} min restantes`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} hrs restantes`;
    return `${Math.round(minutes / 1440)} días restantes`;
  }

  async getSLAs(params = {}) {
    try {
      const response = await this.api.get('/SLA', { params: { range: '0-50', ...params } });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.log('Error obteniendo SLAs:', error.message);
      return [];
    }
  }

  async getOLAs(params = {}) {
    try {
      const response = await this.api.get('/OLA', { params: { range: '0-50', ...params } });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.log('Error obteniendo OLAs:', error.message);
      return [];
    }
  }

  async createTicket(ticketData) {
    return this.createItem('Ticket', ticketData);
  }

  async updateTicket(id, ticketData) {
    return this.updateItem('Ticket', id, ticketData);
  }

  async deleteTicket(id) {
    return this.deleteItem('Ticket', id, { force_purge: true });
  }

  async getTicketFollowups(ticketId) {
    try {
      const response = await this.api.get(`/Ticket/${ticketId}/ITILFollowup`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addTicketFollowup(ticketId, content, options = {}) {
    try {
      const followupData = {
        itemtype: 'Ticket',
        items_id: ticketId,
        content: content,
        is_private: options.isPrivate ? 1 : 0,
        _disablenotif: false,
        _do_not_compute_status: false,
      };

      if (options.requestsource_id) {
        followupData.requesttypes_id = options.requestsource_id;
      }

      const response = await this.api.post('/ITILFollowup', {
        input: followupData,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadDocument(file, ticketId = null) {
    try {
      const formData = new FormData();
      formData.append('uploadManifest', JSON.stringify({
        input: {
          name: file.name,
          _filename: [file.name]
        }
      }));
      formData.append('filename[0]', file);

      const response = await this.api.post('/Document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const documentId = response.data?.id;

      if (documentId && ticketId) {
        await this.linkDocumentToTicket(documentId, ticketId);
      }

      return response.data;
    } catch (error) {
      console.error('Error subiendo documento:', error);
      throw this.handleError(error);
    }
  }

  async linkDocumentToTicket(documentId, ticketId) {
    try {
      const response = await this.api.post('/Document_Item', {
        input: {
          documents_id: documentId,
          items_id: ticketId,
          itemtype: 'Ticket',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('No tienes permisos para adjuntar archivos. Contacta al administrador.');
      }
      throw this.handleError(error);
    }
  }

  async getTicketDocuments(ticketId) {
    try {
      const response = await this.api.get(`/Ticket/${ticketId}/Document_Item`);
      const docItems = response.data || [];

      const documents = await Promise.all(
        docItems.map(async (item) => {
          try {
            const doc = await this.api.get(`/Document/${item.documents_id}`);
            return {
              ...doc.data,
              link_id: item.id,
            };
          } catch (e) {
            return null;
          }
        })
      );

      return documents.filter(d => d !== null);
    } catch (error) {
      return [];
    }
  }

  async canAccessDocuments() {
    try {
      await this.api.get('/Document', { params: { range: '0-1' } });
      return true;
    } catch (error) {
      return false;
    }
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.baseUrl}/Document/${documentId}`;
  }

  async getTicketRequester(ticketId) {
    try {
      const ticketUsers = await this.api.get(`/Ticket/${ticketId}/Ticket_User`);
      const users = ticketUsers.data || [];

      let requester = users.find(u => u.type === 1);

      if (!requester && users.length > 0) {
        requester = users[0];
      }

      if (!requester || !requester.users_id) {
        return null;
      }

      const userData = await this.api.get(`/User/${requester.users_id}`, {
        params: { expand_dropdowns: true, with_emails: true }
      });
      const user = userData.data;

      let email = null;

      const emailFields = [
        'email', '_email', 'useremail', 'useremails', '_useremails',
        'email_address', 'mail', 'email1', 'default_email'
      ];

      for (const field of emailFields) {
        if (user[field]) {
          if (Array.isArray(user[field]) && user[field].length > 0) {
            email = user[field][0];
            break;
          } else if (typeof user[field] === 'string' && user[field].includes('@')) {
            email = user[field];
            break;
          }
        }
      }

      if (!email) {
        try {
          const userEmails = await this.api.get(`/User/${requester.users_id}/UserEmail`);
          const emails = Array.isArray(userEmails.data) ? userEmails.data : [];

          if (emails.length > 0) {
            const primaryEmail = emails.find(e => e.is_default === 1) || emails[0];
            email = primaryEmail?.email;
          }
        } catch (e) {
          // UserEmail endpoint not available
        }
      }

      if (!email) {
        for (const [key, value] of Object.entries(user)) {
          if (typeof value === 'string' && value.includes('@') && value.includes('.')) {
            email = value;
            break;
          }
        }
      }

      if (!email && user.name && user.name.includes('@') && user.name.includes('.')) {
        email = user.name;
      }

      user.email = email;
      return user;
    } catch (error) {
      console.error('Error getting requester:', error);
      return null;
    }
  }

  async getUserEmail(userId) {
    try {
      const userData = await this.getUser(userId);
      if (userData.email) return userData.email;
      if (userData._useremails && userData._useremails.length > 0) {
        return userData._useremails[0];
      }

      const userEmails = await this.api.get(`/User/${userId}/UserEmail`);
      const emails = Array.isArray(userEmails.data) ? userEmails.data : [];
      const primaryEmail = emails.find(e => e.is_default === 1) || emails[0];
      return primaryEmail?.email || null;
    } catch (e) {
      return null;
    }
  }

  async sendTicketNotification(ticketId, notificationType = 'followup') {
    try {
      return { success: true, message: 'Las notificaciones dependen de la configuración de GLPI' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUsers(params = {}) {
    return this.getItems('User', {
      expand_dropdowns: true,
      ...params,
    });
  }

  async getUser(id) {
    return this.getItem('User', id, {
      expand_dropdowns: true,
    });
  }

  async getCategories(params = {}) {
    return this.getItems('ITILCategory', params);
  }

  async getEntities(params = {}) {
    return this.getItems('Entity', params);
  }

  async getGroups(params = {}) {
    return this.getItems('Group', { range: '0-100', ...params });
  }

  async getLocations(params = {}) {
    return this.getItems('Location', { range: '0-100', ...params });
  }

  async getTechnicians(params = {}) {
    try {
      let allUsers = [];
      try {
        const usersRes = await this.api.get('/User', {
          params: { range: '0-100', is_active: 1 }
        });
        allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      } catch (e) {
        return [];
      }

      if (allUsers.length === 0) {
        return [];
      }

      const systemUsers = ['glpi', 'post-only', 'normal', 'glpi-system', 'api'];

      const technicians = allUsers.filter(u => {
        const name = (u.name || '').toLowerCase();
        const id = Number(u.id);
        if (systemUsers.includes(name)) return false;
        if (id <= 2) return false;
        return true;
      });

      return technicians;
    } catch (error) {
      return [];
    }
  }

  async getGroupUsers(groupId) {
    try {
      const response = await this.api.get(`/Group/${groupId}/Group_User`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async assignTicketToGroup(ticketId, groupId) {
    try {
      const response = await this.api.post('/Group_Ticket', {
        input: {
          tickets_id: ticketId,
          groups_id: groupId,
          type: 2,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async assignTicketToUser(ticketId, userId) {
    try {
      const response = await this.api.post('/Ticket_User', {
        input: {
          tickets_id: ticketId,
          users_id: userId,
          type: 2,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketStats() {
    try {
      const [newTickets, inProgress, solved, closed] = await Promise.all([
        this.search('Ticket', [{ field: 12, searchtype: 'equals', value: 1 }], { range: '0-0' }),
        this.search('Ticket', [{ field: 12, searchtype: 'equals', value: 2 }], { range: '0-0' }),
        this.search('Ticket', [{ field: 12, searchtype: 'equals', value: 5 }], { range: '0-0' }),
        this.search('Ticket', [{ field: 12, searchtype: 'equals', value: 6 }], { range: '0-0' }),
      ]);

      return {
        new: newTickets.totalcount || 0,
        inProgress: inProgress.totalcount || 0,
        solved: solved.totalcount || 0,
        closed: closed.totalcount || 0,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTechnicianTicketStats(userId) {
    try {
      const [assigned, newTickets, inProgress] = await Promise.all([
        this.search('Ticket', [{ field: 5, searchtype: 'equals', value: userId }], { range: '0-0' }),
        this.search('Ticket', [
          { field: 5, searchtype: 'equals', value: userId },
          { field: 12, searchtype: 'equals', value: 1, link: 'AND' },
        ], { range: '0-0' }),
        this.search('Ticket', [
          { field: 5, searchtype: 'equals', value: userId },
          { field: 12, searchtype: 'equals', value: 2, link: 'AND' },
        ], { range: '0-0' }),
      ]);

      return {
        assigned: assigned.totalcount || 0,
        new: newTickets.totalcount || 0,
        inProgress: inProgress.totalcount || 0,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketsAssignedToUser(userId, params = {}) {
    try {
      const criteria = [
        { field: 5, searchtype: 'equals', value: userId },
      ];
      return this.search('Ticket', criteria, {
        range: params.range || '0-50',
        order: 'DESC',
        ...params,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketsAssignedToGroup(groupId, params = {}) {
    try {
      const criteria = [
        { field: 8, searchtype: 'equals', value: groupId },
      ];
      return this.search('Ticket', criteria, {
        range: params.range || '0-50',
        order: 'DESC',
        ...params,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketsCreatedByUser(userId, params = {}) {
    try {
      const criteria = [
        { field: 4, searchtype: 'equals', value: userId },
      ];
      return this.search('Ticket', criteria, {
        range: params.range || '0-50',
        order: 'DESC',
        ...params,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyTickets(params = {}) {
    try {
      const response = await this.api.get('/Ticket', {
        params: {
          range: params.range || '0-100',
          expand_dropdowns: true,
          order: 'DESC',
          sort: 'date_mod',
          ...params
        }
      });

      const tickets = response.data;

      if (Array.isArray(tickets)) {
        return tickets;
      }

      return [];
    } catch (error) {
      try {
        const session = await this.getFullSession();
        const userId = session?.session?.glpiID;

        if (userId) {
          const result = await this.search('Ticket', [
            { field: 4, searchtype: 'equals', value: userId }
          ], { range: '0-100' });

          return result.data || [];
        }
      } catch (e) {
        console.error('Error en búsqueda alternativa:', e);
      }

      return [];
    }
  }

  async getUnassignedTickets(params = {}) {
    try {
      const criteria = [
        { field: 5, searchtype: 'equals', value: 0 },
      ];
      return this.search('Ticket', criteria, {
        range: params.range || '0-50',
        order: 'DESC',
        ...params,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchTicketsAdvanced(filters = {}, params = {}) {
    try {
      const criteria = [];
      let criteriaIndex = 0;

      if (filters.status && filters.status !== 'all') {
        criteria.push({ field: 12, searchtype: 'equals', value: filters.status });
        criteriaIndex++;
      }

      if (filters.assignedTo) {
        criteria.push({
          field: 5, searchtype: 'equals', value: filters.assignedTo,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
        criteriaIndex++;
      }

      if (filters.assignedGroup) {
        criteria.push({
          field: 8, searchtype: 'equals', value: filters.assignedGroup,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
        criteriaIndex++;
      }

      if (filters.requesterId) {
        criteria.push({
          field: 4, searchtype: 'equals', value: filters.requesterId,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
        criteriaIndex++;
      }

      if (filters.searchText) {
        criteria.push({
          field: 1, searchtype: 'contains', value: filters.searchText,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
        criteriaIndex++;
      }

      if (filters.unassigned) {
        criteria.push({
          field: 5, searchtype: 'equals', value: 0,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
        criteriaIndex++;
      }

      if (filters.priority && filters.priority !== 'all') {
        criteria.push({
          field: 3, searchtype: 'equals', value: filters.priority,
          link: criteriaIndex > 0 ? 'AND' : undefined,
        });
      }

      if (criteria.length > 0) {
        return this.search('Ticket', criteria, {
          range: params.range || '0-50',
          order: 'DESC',
          ...params,
        });
      } else {
        const result = await this.getTickets({
          range: params.range || '0-50',
          order: 'DESC',
          ...params,
        });
        return {
          data: Array.isArray(result) ? result : [],
          totalcount: Array.isArray(result) ? result.length : 0,
        };
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyGroups() {
    try {
      const response = await this.api.get('/getMyEntities');
      return response.data;
    } catch (error) {
      try {
        const session = await this.getFullSession();
        return session?.session?.glpigroups || [];
      } catch (e) {
        return [];
      }
    }
  }

  async getTicketAssignees(ticketId) {
    try {
      const [users, groups] = await Promise.all([
        this.api.get(`/Ticket/${ticketId}/Ticket_User`).catch(() => ({ data: [] })),
        this.api.get(`/Ticket/${ticketId}/Group_Ticket`).catch(() => ({ data: [] })),
      ]);
      return {
        users: users.data || [],
        groups: groups.data || [],
      };
    } catch (error) {
      return { users: [], groups: [] };
    }
  }

  async removeTicketUserAssignment(assignmentId) {
    try {
      const response = await this.api.delete(`/Ticket_User/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeTicketGroupAssignment(assignmentId) {
    try {
      const response = await this.api.delete(`/Group_Ticket/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.[0] || error.response.data?.message || 'Error en la API de GLPI';
      return new Error(message);
    }
    return error;
  }
}

export const glpiApi = new GlpiApiService();
export default glpiApi;
