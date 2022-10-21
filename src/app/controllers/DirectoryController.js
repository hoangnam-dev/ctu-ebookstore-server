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
    let directoryID = req.params.id;

    Directory.findOne({
        where: {
            DIRECTORYID : directoryID
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
    let directoryID = req.params.id;
    console.log(directory);

    Directory.update({
        DIRECTORYNAME: directory.directoryName,
        DIRECTORYDESCRIPTION: directory.directoryDescription,
    }, {
        where: {
            DIRECTORYID: directoryID
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
    let directoryID = req.params.id;

    Directory.destroy({
        where: {
            DIRECTORYID : directoryID
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