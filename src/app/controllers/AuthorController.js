const Author = require('../models/Author');

const allAuthor = (req, res, next) => {
    Author.findAll()
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

const getAuthorByID = (req, res, next) => {
    let authorID = req.params.id;

    Author.findOne({
        where: {
            AUTHORID : authorID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving author."
      });
    });
};

const store = (req, res, next) => {
    let author = req.body;

    Author.create({
        AUTHORNAME: author.authorName,
        AUTHORSTORY: author.authorStory,
        AUTHORBIRTHDATE: author.authorBirthdate,
        AUTHORGENDER: author.authorGender,
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving author."
      });
    });
};

const update = (req, res, next) => {
    let author = req.body;
    let authorID = req.params.id;
    console.log(author);

    Author.update({
        AUTHORNAME: author.authorName,
        AUTHORSTORY: author.authorStory,
        AUTHORBIRTHDATE: author.authorBirthdate,
        AUTHORGENDER: author.authorGender,
    }, {
        where: {
            AUTHORID: authorID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving author."
      });
    });
};

const destroy = (req, res, next) => {
    let authorID = req.params.id;

    Author.destroy({
        where: {
            AUTHORID : authorID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while destroy author."
      });
    });
};



module.exports = {
    allAuthor,
    getAuthorByID,
    store,
    update,
    destroy,
}