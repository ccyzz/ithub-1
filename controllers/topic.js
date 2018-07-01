const categoryModel = require('../models/category');
const topicModel = require('../models/topic');

// 1 显示添加话题的页面
exports.showCreate = (req, res) => {
  categoryModel.getAll((err, categories) => {
    res.render('topic/create.html', {
      categories,
      user: req.session.user
    });
  });
};
// 2 处理添加话题  -- 接口
exports.handleCreate = (req, res) => {
  // 判断session中是否有数据
  if (!req.session.user) {
    res.json({
      code: 403,
      msg: '登录过期，请先登录'
    });
  }
  // TODO   验证用户输入
  req.body.userId = req.session.user.id;
  req.body.createdAt = new Date();
  topicModel.createTopic(req.body, (err, isOK) => {
    if (err) {
      return res.json({
        code: 500,
        msg: '服务器内部错误'
      });
    }
    if (isOK) {
      res.json({
        code: 200,
        msg: '添加话题成功'
      });
    } else {
      res.json({
        code: 400,
        msg: '话题添加失败'
      });
    }
  });
};

exports.showTopic = (req, res) => {
  // 1. 通过查询字符串传参  /topic/show?id=1
  // .get('/topic/show', topicCtrl.showTopic)
  //  id=1&name=ab  ->>> { id: '1', name: 'ab' }
  // req.query是对象，express内部把浏览器传递过来的字符串，解析成了对象
  // console.log(req.query.id);

  // 2. 动态路由
  // .get('/topic/:topicID', topicCtrl.showTopic)
  // console.log(req.params.topicID);


  res.send('showTopic');
};
exports.showEdit = (req, res) => {
  res.send('showEdit');
};
exports.handleEdit = (req, res) => {
  res.send('handleEdit');
};
exports.handleDelete = (req, res) => {
  res.send('handleDelete');
};