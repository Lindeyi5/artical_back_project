const db = require('../db/index')

// 获取帖子分类
exports.getArticleCates = async (req, res) => {
    const sql = 'select * from en_article_cate where is_delete = 0 order by id asc'

    let results = []
    try {
        results = await db.queryByPromisify(sql)
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '获取帖子分类成功',
        data: results
    })
}

// 新增帖子分类
exports.addArticleCates = async (req, res) => {
    const sql = 'select * from en_article_cate where name = ? or alias = ?'
    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.body.name, req.body.alias])

        if (results.length === 1) {
            if (results[0].alias == req.body.alias && results[0].name == req.body.name) {
                return res.cc('分类名称和分类别名已被占用')
            }
            if (results[0].name == req.body.name) {
                return res.cc('分类名称已被占用')
            }
            if (results[0].alias == req.body.alias) {
                return res.cc('分类别名已被占用')
            }
        }
        if (results.length === 2) { // name，alias分别被两条数据占用
            return res.cc('分类名称和分类别名已被占用')
        }
    } catch (e) {
        return res.cc(e)
    }

    const sqlInsert = 'insert into en_article_cate set ?'

    let resultInsert = null
    try {
        resultInsert = await db.queryByPromisify(sqlInsert, req.body)

        if (resultInsert.affectedRows !== 1) {
            return res.cc('新增帖子分类失败2')
        }
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '新增帖子分类成功'
    })
}

// 根据ID删除帖子分类
exports.deleteArticleById = async (req, res) => {
    const sql = 'update en_article_cate set is_delete = 1 where id = ?'
    try {
        let result = await db.queryByPromisify(sql, req.params.id)
        if (result.affectedRows !== 1) {
            return res.cc('删除帖子分类失败1')
        }
    } catch (e) {
        return res.cc(e)
    }
    const sql2 = 'update en_articles set is_delete = 1 where cate_id = ?'
    try {
        await db.queryByPromisify(sql2, req.params.id)
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '删除帖子分类成功'
    })
}

// 根据ID获取帖子分类
exports.getArticleCateById = async (req, res) => {
    const sql = 'select * from en_article_cate where id = ?'
    let result = []
    try {
        result = await db.queryByPromisify(sql, req.params.id)
        if (result.length !== 1) {
            return res.cc('帖子分类不存在')
        }
    } catch (e) {
        return res.cc(e)
    }
    res.send({
        status: 0,
        msg: '获取帖子分类成功',
        data: result[0]
    })
}

// 根据ID更新帖子分类
exports.updateCateById = async (req, res) => {
    const sql = 'select * from en_article_cate where id != ? and (name = ? or alias = ?)'
    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.body.id, req.body.name, req.body.alias])

        if (results.length === 1) {
            if (results[0].name == req.body.name && results[0].alias == req.body.alias) {
                return res.cc('分类名称和别名已经被占用')
            }

            if (results[0].name == req.body.name) {
                return res.cc('分类名称已经被占用')
            }

            if (results[0].alias == req.body.alias) {
                return res.cc('分类别名已经被占用')
            }
        }

        if (results.length === 2) {
            return res.cc('分类名称和别名已经被占用')
        }
    } catch (e) {
        res.cc(e)
    }

    const sqlUpdate = 'update en_article_cate set ? where id = ?'

    let result = null
    try {
        result = await db.queryByPromisify(sqlUpdate, [req.body, req.body.id])

        if (result.affectedRows !== 1) {
            return res.cc('更新帖子分类失败2')
        }
    } catch (e) {
        console.log(e);
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '更新帖子分类成功'
    })
}