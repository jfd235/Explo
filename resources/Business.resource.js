import FetchResource from "./Fetch.resource";

class BusinessResource extends FetchResource {
  async getRestaurants(geolocation) {
    return await this.get(
      `/businesses/search?term=restaurants&latitude=${geolocation.latitude}&longitude=${geolocation.longitude}&sort_by=distance&limit=50`
    );
  }

  async getRestaurantDetails(id) {
    return await this.get(
      `/businesses/${id}`
    );
  }
}

export default BusinessResource;
