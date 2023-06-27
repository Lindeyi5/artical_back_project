const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use('/uploads', express.static('./uploads'))
app.use(express.static('./web'))

app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})

// jwt解析
const expressJWT = require('express-jwt')
const config = require('./confg')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

const artCateRouter = require('./router/artcate')
app.use('/my/artcate', artCateRouter)

const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 配置全局错误级别中间件
const joi = require('joi')
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    if (err.name == 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }
    res.cc(err)
})

app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})