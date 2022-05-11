import { BaseResourceModel } from "../../../shared/models/base-resource.model";

export class Category extends BaseResourceModel {
    constructor(
        public user_id?:string,
        public id?:string,
        public name?: string,
        public description?: string
    ){
        super();
    }
}