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
  // 获取url传递的id，动态路由
  const topicID = req.params.topicID;
  if (isNaN(topicID)) {
    // 不是一个数字
    return res.send('参数错误');
  }

  topicModel.getById(topicID, (err, topic) => {
    if (err) {
      return res.send('服务器内部错误');
    }
    if (topic) {
      res.render('topic/show.html', {
        topic,
        user: req.session.user
      });
    } else {
      res.send('您查询的话题不存在');
    }
  });

  // 1. 通过查询字符串传参  /topic/show?id=1
  // .get('/topic/show', topicCtrl.showTopic)
  //  id=1&name=ab  ->>> { id: '1', name: 'ab' }
  // req.query是对象，express内部把浏览器传递过来的字符串，解析成了对象
  // console.log(req.query.id);

  // 2. 动态路由
  // .get('/topic/:topicID', topicCtrl.showTopic)
  // console.log(req.params.topicID);

  // res.send('showTopic');
};
exports.showEdit = (req, res) => {
  // res.render('topic/edit.html');
  // 获取所有版块（分类）
  categoryModel.getAll((err, categories) => {
    // 根据id获取当前话题
    // .get('/topic/:topicID/edit', topicCtrl.showEdit)
    const id = req.params.topicID;
    if (isNaN(id)) {
      // 判断id是否是数字，不是数字
      return res.send('参数错误');
    }
    topicModel.getById(id, (err, topic) => {
      if (err) {
        return res.send('服务器内部错误');
      }
      if (topic) {
        // 渲染模板，返回给浏览器
        res.render('topic/edit.html', {
          categories,
          topic,
          user: req.session.user
        });
      } else {
        res.send('没有查询到数据');
      }
    });
  });
};
exports.handleEdit = (req, res) => {
  // ajax的请求
  // .post('/topic/:topicID/edit', topicCtrl.handleEdit)
  // 获取url中的id
  const id = req.params.topicID;
  // TODO 判断是否是数字
  // 获取请求过来的数据
  // req.body
  req.body.id = id;
  // TODO 数据验证
  topicModel.update(req.body, (err, isOK) => {
    if (err) {
      return res.json({
        code: 500,
        msg: '服务器内部错误'
      });
    }
    if (isOK) {
      res.json({
        code: 200,
        msg: '修改成功'
      });
    } else {
      res.json({
        code: 403,
        msg: '修改失败'
      });
    }
  });
};
exports.handleDelete = (req, res) => {
  // 传统的请求响应方式实现
  // 1 获取url上传递过来的id
  // .get('/topic/:topicID/delete', topicCtrl.handleDelete)
  const id = req.params.topicID;
  // 2 删除数据
  topicModel.delete(id, (err, isOK) => {
    if (err) {
      return res.send('服务器内部错误');
    }
    if (isOK) {
      res.redirect('/');
    } else {
      // 传统的请求响应方式，不好
      // 错误的时候，也要重新渲染整个页面
      res.send('删除失败');
    }
  });
};