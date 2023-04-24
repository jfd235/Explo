class FetchResource {
  constructor(baseUrl = "https://api.yelp.com/v3") {
    this.baseUrl = baseUrl;
    this.apiKey =
      "kObDJ5-YS8EgFSMwNGPe1XrC2WHCmXxKKFWfsyMAXRDmSmIVBEwyF1bH3HqceHZc5cmsAOtFrFsW982qAdVQ7o1R4UJPVc_BavLBp7ylF2vvKziyawymaurEtifkXXYx";
    this.requestDetails = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    };
  }

  async get(resource) {
    try {
      this.requestDetails.method = "GET";
      const response = await fetch(
        this.baseUrl + resource,
        this.requestDetails
      );
      console.log(response)
      return this._handleResponse(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async _handleResponse(response) {
    if (response.ok) {
      const result = await response.json();
      return result ? result : "Sorry, No Content";
    } else {
      return Promise.reject({
        status: response.status,
        message: response.statusText
          ? response.statusText
          : "Sorry, an unexpected error happened."
      });
    }
  }
}

export default FetchResource;
