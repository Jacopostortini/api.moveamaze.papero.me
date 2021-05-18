const mongoose = require("mongoose");

class Player extends mongoose.Model{
  constructor(object){
    super(object);
  }

  async save(){
    await super.save();
  }

  async remove(){
    await super.remove();
  }

  static async findByUserId(userId){
    return await super.findOne({userId}).exec();
  }

  async
}
