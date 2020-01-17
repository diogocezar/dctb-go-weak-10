const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, longitude, latitude } = req.body;

    try {
      let dev = await Dev.findOne({
        github_username
      });

      if (!dev) {
        const apiResponse = await axios.get(
          `https://api.github.com/users/${github_username}`
        );

        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = techs.split(",").map(tech => tech.trim());

        const location = {
          type: "Point",
          coordinates: [longitude, latitude]
        };

        dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location
        });
      }

      if (
        dev.location.coordinates[0] != longitude ||
        dev.location.coordinates[1] != latitude
      ) {
        const location = {
          type: "Point",
          coordinates: [longitude, latitude]
        };
        console.log(dev._id);
        dev = await Dev.findOneAndUpdate(
          { _id: dev._id },
          { location },
          { new: true }
        );
      }

      return res.status(200).json(dev);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: true });
    }
  }
};
