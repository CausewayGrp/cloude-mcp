// Minimal Microsoft Graph + SharePoint REST client for the provisioner.
// Standalone (uses global fetch, Node 18+) so the CauseWay layer can run without
// the mcp-sharepoint server process — though it deliberately mirrors that
// server's application/delegated auth contract and Graph shapes.

const GRAPH = "https://graph.microsoft.com/v1.0";

export class GraphClient {
  constructor(cfg) {
    this.cfg = cfg;
    this._graphToken = null;
    this._spToken = null;
  }

  async _tokenFor(scope) {
    const { tenantId, clientId, clientSecret } = this.cfg;
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope,
    });
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!res.ok) throw new Error(`token request failed (${res.status}): ${await res.text()}`);
    return (await res.json()).access_token;
  }

  async graphToken() {
    if (this.cfg.authMode === "delegated") return this.cfg.accessToken;
    if (!this._graphToken) this._graphToken = await this._tokenFor("https://graph.microsoft.com/.default");
    return this._graphToken;
  }

  async spToken(host) {
    if (this.cfg.authMode === "delegated") return this.cfg.accessToken;
    if (!this._spToken) this._spToken = await this._tokenFor(`https://${host}/.default`);
    return this._spToken;
  }

  async _graph(method, path, body) {
    const token = await this.graphToken();
    const res = await fetch(`${GRAPH}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`Graph ${method} ${path} failed (${res.status}): ${await res.text()}`);
    }
    return res.status === 204 ? {} : res.json();
  }

  // ---- lists / columns / items ----
  async getLists(siteId) {
    const r = await this._graph("GET", `/sites/${siteId}/lists?$select=id,name,displayName`);
    return r.value || [];
  }

  async createList(siteId, displayName, description) {
    return this._graph("POST", `/sites/${siteId}/lists`, {
      displayName,
      description: description || "",
      list: { template: "genericList" },
    });
  }

  async getColumns(siteId, listId) {
    const r = await this._graph("GET", `/sites/${siteId}/lists/${listId}/columns?$select=id,name`);
    return r.value || [];
  }

  async addColumn(siteId, listId, columnDefinition) {
    return this._graph("POST", `/sites/${siteId}/lists/${listId}/columns`, columnDefinition);
  }

  async getItems(siteId, listId) {
    const r = await this._graph("GET", `/sites/${siteId}/lists/${listId}/items?$expand=fields`);
    return r.value || [];
  }

  async addItem(siteId, listId, fields) {
    return this._graph("POST", `/sites/${siteId}/lists/${listId}/items`, { fields });
  }

  async getWebUrl(siteId) {
    const r = await this._graph("GET", `/sites/${siteId}?$select=webUrl`);
    return r.webUrl;
  }

  // ---- views (SharePoint REST — Graph cannot create views) ----
  async createView(siteId, listId, { title, fields, query, rowLimit }) {
    const webUrl = await this.getWebUrl(siteId);
    const host = new URL(webUrl).host;
    const token = await this.spToken(host);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;odata=verbose",
      Accept: "application/json;odata=verbose",
    };
    const create = await fetch(`${webUrl}/_api/web/lists(guid'${listId}')/views`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        __metadata: { type: "SP.View" },
        Title: title,
        PersonalView: false,
        RowLimit: rowLimit || 30,
        ViewQuery: query || "",
      }),
    });
    if (!create.ok) throw new Error(`create view '${title}' failed (${create.status}): ${await create.text()}`);
    if (Array.isArray(fields) && fields.length) {
      const base = `${webUrl}/_api/web/lists(guid'${listId}')/views/getbytitle('${encodeURIComponent(title)}')/viewfields`;
      await fetch(`${base}/removeallviewfields`, { method: "POST", headers });
      for (const f of fields) {
        await fetch(`${base}/addviewfield('${encodeURIComponent(f)}')`, { method: "POST", headers });
      }
    }
    return { title };
  }
}
