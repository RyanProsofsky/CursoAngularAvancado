import { BaseResourceModel } from "../models/base-resource.model";

import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { map, catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    private user_id: string = 'ryan_prosofsky';

    protected http: HttpClient;

    constructor(
        protected apiPath: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: any) => T
    ){
        this.http = injector.get(HttpClient);
    }

    // queryParamns
    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath, { params: { ['user_id']: this.user_id } }).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)
        )
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;

        return this.http.get(url, { params: { ['user_id']: this.user_id } }).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)
            
        )
    }
    // queryParamns

    // body
    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)

        )
    }

    // body
    update(resource: T): Observable<T> {
        const url = `${this.apiPath}`;

        return this.http.put(url, resource).pipe(
            map(() => resource),
            catchError(this.handleError)
        )
    }

    // params
    delete(id: string): Observable<any> {
        const url = `${this.apiPath}`;

        return this.http.delete(url, { params: { ['user_id']: this.user_id, ['id']: id } }).pipe(
            map(() => null),
            catchError(this.handleError)
        )
    }
    // PROTECTED METHODS

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push( this.jsonDataToResourceFn(element) )
        );
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any> {
        console.log("ERRO NA REQUISIÇÃO =>", error);
        return throwError(error)
    }
}