const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM

module.exports.ActionHandler = function (engine) {
    this.engine = engine

    this.handle = (action) => {
        if (action && action.validate(this.engine)) {
            this.engine.connection.send(
                JSON.stringify(
                    {
                        type: MESSAGE_ENUM.CLIENT_ACTION,
                        body: action,
                    }
                )
            )
            return true
        }
        return false
    }
}