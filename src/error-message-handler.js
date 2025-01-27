import { TypeMatcher } from "./types/_type-matcher";

export class ErrorMessageHandler extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
    this.constraints = typeHandler.constraints;
    this.errMessages = typeHandler.errMessages;
    this.key = typeHandler.key;
    this.type = typeHandler.type;
    this.description = typeHandler.description
    this.title = typeHandler.title
  }

  valErrMessage(msgName) {
    const { constraints, description, title } = this;
    const errMsg = this.errMessageFor(msgName);
    return typeof errMsg === "function" ? errMsg(constraints, { description, title}) : errMsg;
  }

  errMessageFor(msgName) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    return errMsg ? errMsg[msgName] : errMessages[`$${msgName}`];
  }
}
