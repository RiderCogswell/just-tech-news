const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');
const { up } = require('inquirer/lib/utils/readline');

// GET all users
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal('SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST a post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/posts/upvote
// must be above the /:id PUT route or it will think 'upvote' is valid for /:id
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
// SAME AS
    // Vote.create({
    //     user_id: req.body.user_id,
    //     post_id: req.body.post_id
    // }).then(() => {
    //     // find the post we just voted on
    //     return Post.findOne({
    //         where: {
    //             id: req.body.post_id
    //         },
    //         attributes: [
    //             'id',
    //             'post_url',
    //             'title',
    //             'created_at',
    //             // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name vote_count
    //             [
    //                 // make actual call to db
    //                 sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
    //                 // let that data be known as vote_count
    //                 'vote_count'
    //             ]
    //         ]
        // })
        // .then(dbPostData => res.json(dbPostData))
        // .catch(err => {
        //     console.log(err);
        //     res.status(400).json(err);
        //     });
        // })
});

// update a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title:req.body.title
        },
        {
            where: {
            id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.json(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.json(500).json(err);
    });
});

// DELETE a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404) .json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;
