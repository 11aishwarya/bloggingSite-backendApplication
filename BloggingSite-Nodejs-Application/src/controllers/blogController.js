const blogModel = require("../models/blogModel");

const createBlog = async (req, res) => {
  const { title, description, authorId, tags, category, subcategory } =
    req.body;
  if (!title) {
    return res.send({ status: false, message: "title is required" });
  }
  if (!description) {
    return res.send({ status: false, message: "description is required" });
  }
  req.body.authorId = req.userId;

  if (!category) {
    return res.send({ status: false, message: "category is requried" });
  }

  const savedBlog = await blogModel.create(req.body);
  return res.send({
    status: true,
    message: "Blog created successfully",
    blogData: savedBlog,
  });
};
const getBlogById = async (req, res) => {
  const { authorId, blogId } = req.body;
  const findBlog = await blogModel.findOne({ authorId: authorId, _id: blogId });
  return res.send({ status: true, blogs: findBlog });
};
const getBlogs = async (req, res) => {
  const getBlog = await blogModel.find().sort("-1");
  return res.send({ status: true, message: "Blogs", data: getBlog });
};

const publishedBlog = async (req, res) => {
  const { authorId, blogId } = req.body;
  const updatedBlog = await blogModel.findOneAndUpdate(
    { _id: blogId, authorId: authorId, isDeleted: false },
    { $set: { isPublished: true, publishedAt: Date.now() } },
    { new: true }
  );
  return res.send({
    status: true,
    message: "Blog created successfully",
    data: updatedBlog,
  });
};

const deleteBlogs = async function (req, res) {
  try {
    let loggedUserId = req.authorId;
    let data = req.query;

    const { category, authorId, tags, subcategory, isPublished } = data;

    if (authorId) {
      if (!objectId.isValid(authorId)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid author id" });
      }

      if (data.authorId !== loggedUserId) {
        return res
          .status(401)
          .send({ status: false, message: "Authorisation failed" });
      }
      let deletedData = await BlogModel.updateMany(
        { authorId: authorId, isDeleted: false, isPublished: false },
        { isDeleted: true, deletedAt: Date.now() }
      );
      if (deletedData.modifiedCount != 0) {
        return res
          .status(200)
          .send({ status: true, msg: "deleted successfully" });
      }
      console.log(data.authorId);
    }
    if (category) {
      let deletedData = await BlogModel.updateMany(
        { category: category, isDeleted: false, isPublished: false },
        { isDeleted: true, deletedAt: Date.now() }
      );
      if (deletedData.modifiedCount != 0) {
        return res
          .status(200)
          .send({ status: true, msg: "deleted successfully" });
      }
    }

    if(tags){
      let findedData = await BlogModel.find({isDeleted:false});
      let filteredData = findedData.filter((doc) => {
        let alltag = doc.tags;
        return alltag.find(tag => tag == tags);
      })
      letnidArr = [];
      filteredData.forEach(doc => {
        idArr.push(doc._id);
      })
      let deletedData = await Blogmodel.updateMany({_id: {$in : idArr}, authorid: loggedUserId,loggedUserId,isPublished:false},{isDeleted : true, deletedAt:Date.now()});
      if(deletedData.modifiedCount != 0){
        return res.status(200).send({status: true , msg:"deletednsuccessfully"});
      }
    }

    if(subcategory){
      let findedData = await BlogModel.find({ isDeleted: false});
      let filteredData = findedData.filter((doc) => {
        let alltag = doc.subcategory;
        return alltag.find(subcat => subcat == subcategory);
      })
      let idArr = [];
      filteredData.forEach(doc => {
        idArr.push(doc._id);
      })
      let deletedData = await blogModel.updateManyy({ _id: { $in: idArr }, authorId: loggedUserId, isPublished: false }, { isDeleted: true, deletedAt: Date.now() });
      if(deletedData.modifiedCount != 0){
        return res.satus(200).send({status:true, msg: "deleted successfully"});
      }
    }

    if (isPublished) {
      if (req.query.isPublished == "true") {
        return res
          .status(400)
          .send({ status: false, msg: "Document published is not deleted" });
      }
      let deletedData = await BlogModel.updateMany(
        { isPublished: isPublished, isDeleted: false, authorId: loggedUserId },
        { isDeleted: true, deletedAt: Date.now() }
      )
      if (deletedData.modifiedCount != 0) {
        return res
          .status(200)
          .send({ status: true, msg: "deleted successfully" });
      }
    }
    return res
      .status(404)
      .send({ status: false, msg: "no data is found to be deleted" });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports = { getBlogs, createBlog, publishedBlog, deleteBlogs };
