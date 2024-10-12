class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr
    }
   //Searching for product
    search(){
        let keyword = this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword, //searching quary 
                $options: 'i' // case insintive upper case or lower case

            }
        }:{};

        this.query.find({...keyword});
        return this;
    }
    // filer for price
    filter(){
        const queryStrCopy = { ...this.queryStr}

        //remoing fields from query
        const removeFields =['Keyword','limit','page'];
        removeFields.forEach( field=> delete queryStrCopy[field]);

        let queryStr = JSON.stringify(queryStrCopy);
         queryStr=queryStr.replace(/\b(gt|gte|lt|lte)/g, match =>`$${match}`);// gt= graterthen gte=greater then= Lt=lessthen lte= lessthan=

        this.query.find(JSON.parse(queryStr));

        return this;
    }

     // page count
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
    
}

module.exports = APIFeatures