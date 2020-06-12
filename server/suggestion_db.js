class Suggestion_db {

    constructor(mongoose) {

        var userSchema = new mongoose.Schema ({

            username: String,
            password: String,
            admin:Boolean,
            fullname:String

        });

        var suggestionSchema = new mongoose.Schema({

            suggestion: String,
            desc:String,
            submitted:{type:Date , default: Date.now()},
            fullname:String,
            signature: [{username: {type:String } , time: {type: Date, default: Date.now}}]

        });


        this.userModel = mongoose.model('user', userSchema);
        this.suggestionModel = mongoose.model('suggestion' , suggestionSchema);
    }

    async getSuggestions() {
        try {
            return await this.suggestionModel.find({}).sort('time');
        }
        catch (error) {
            console.error("getSuggestions: " , error.message);
            return {};
        }
    }

    async getUsers() {
        try {
            return await this.userModel.find({});
        }
        catch (error) {
            console.error("getUsers: " , error.message);
            return {};
        }
    }

    async getSuggestion(id) {
        try{
            return await this.suggestionModel.findById(id);
        }
        catch (error) {
            console.log("getSuggestion" , error.message);
            return {};
        }
    }

    async createSuggestion(newSuggestion) {
       try {
           let question = new this.suggestionModel(newSuggestion);
           return await question.save();
       }

       catch (error) {
           console.log("createSuggestion", error.message);
           return {};
       }
    }

    async postSignature(id , user) {
        try {
            let sugges = await this.getSuggestion(id);
           // let finder = sugges.signature.username;
            let signat = {
                username:user,
                time: undefined
            };
         //   if(signat.username === finder )


              sugges.signature.push(signat)
            console.log("pribina")
            return await sugges.save()
        }
        catch (error) {
        console.log("postSignature" , error.message)
        }
    }

    async populateDb () {

        if (this.getSuggestions().length === 0) {

            try {
                var suggestion1 = new this.suggestionModel(
                    {
                        suggestion: "People should read less and drink more",
                        desc:"Studies have shown that people who drink more and read less have a tendency of having a higher IQ",
                        submitted: Date.now(),
                        fullname:"John Smith",
                        signature: [{username: "Some User", time: Date.now()}]
                    });
                console.log(suggestion1);
                suggestion1.save(function (err, suggestion1) {
                    if (err) return console.error(err);
                    console.log(suggestion1.signature.username)
                });
            } catch (error) {
                console.error("populateDb:", error.message)

            }
        }

    }
    async populateDb2 () {

              try {
                  var user1 = new this.userModel(
                      {
                          username: "user1",
                          password: "mama",
                          admin: true,
                          fullname: "John Smith"
                      });
                  console.log(user1);
                  user1.save(function (err, user1) {
                      if (err) return console.error(err);
                      console.log(user1.username)
                  });
              } catch (error) {
                  console.error("populateDb2:", error.message)

              }

    }




}

module.exports = mongoose => new Suggestion_db(mongoose);