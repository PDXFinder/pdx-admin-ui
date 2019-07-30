import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MappingInterface} from "./mapping-interface";
import {Observable, Subject, throwError} from "rxjs/index";
import {catchError} from "rxjs/internal/operators";
import {SummaryInterface} from "./summary-interface";

@Injectable({
  providedIn: 'root'
})
export class MappingService {

    private _totalMappedUrl = "/api/mappings?map-terms-only=true&entity-type=diagnosis&size=900";
    private _unmappedTreatmentUrl = "/api/mappings?entity-type=treatment&mapped-term=-";
    private _unmappedDiagnosisUrl = "/api/mappings?entity-type=diagnosis&mapped-term=-";
    private _summaryUrl = "/api/mappings/summary";

    private _submitCurationUrl = "/api/diagnosis";

    public dataSubject = new Subject<any>();

    constructor(private http: HttpClient) { }


    getDiagnosisSummary(maptype: string): Observable<SummaryInterface[]>{

        const url = `${this._summaryUrl}?entity-type=${maptype}`;

        return this.http.get<SummaryInterface[]>(url);
    }

    //Retrieve unmapped diagnosis entities
    getUnmappedDiagnosis(): Observable<MappingInterface[]>{

        return this.http.get<MappingInterface[]>(this._unmappedDiagnosisUrl);
    }

    //Retrieve unmapped treatments
    getUnmappedTreatment(): Observable<MappingInterface[]>{

        return this.http.get<MappingInterface[]>(this._unmappedTreatmentUrl);
    }

    //Retrieve Total mapped diagnosis
    connectTotalMappedStream(): Observable<MappingInterface[]>{

        return this.http.get<MappingInterface[]>(this._totalMappedUrl);

    }

    componentsDataBus(data): void{
        this.dataSubject.next(data);
    }


    submitCuration (mappings: MappingInterface) {

        return this.http.post<any>(this._submitCurationUrl, mappings)
            .pipe(catchError(this.errorHandler));
    }


    errorHandler(error: HttpErrorResponse) {
        return throwError(error);
    }

/*    connectToDataFlow() {

        return fetch('http://localhost:8081/api/mapping/diagnosis?ds=JAX')
            .then((res) => res.json())
            .then((data) => data)
            .catch(error => console.log(error));
    }*/



}
