const Directory = require('../models/Directory');

const allDirectory = (req, res, next) => {
    Directory.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directories."
      });
    });

};

const getDirectoryByID = (req, res, next) => {
    let directoryId = req.params.id;

    Directory.findOne({
        where: {
            DIRECTORYID : directoryId
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory."
      });
    });
};

const store = (req, res, next) => {
    let directory = req.body;
    console.log(directory.directoryName);

    Directory.create({
        DIRECTORYNAME: directory.directoryName,
        DIRECTORYDESCRIPTION: directory.directoryDescription,
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory."
      });
    });
};

const update = (req, res, next) => {
    let directory = req.body;
    let directoryId = req.params.id;
    console.log(directory);

    Directory.update({
        DIRECTORYNAME: directory.directoryName,
        DIRECTORYDESCRIPTION: directory.directoryDescription,
    }, {
        where: {
            DIRECTORYID: directoryId
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory."
      });
    });
};

const destroy = (req, res, next) => {
    let directoryId = req.params.id;

    Directory.destroy({
        where: {
            DIRECTORYID : directoryId
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while destroy directory."
      });
    });
};



module.exports = {
    allDirectory,
    getDirectoryByID,
    store,
    update,
    destroy,
}