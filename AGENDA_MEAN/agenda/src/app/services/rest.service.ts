import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  //Peticion al servidor:
  constructor(private http: HttpClient) { }
  
  //Consultamos agenda
  public getAll(): Observable<any> {
    return this.http.get(`http://localhost:5000/contactos`);
  }

  //Consultamos un sólo contacto
  public getContact(id: String): Observable<any> {
    return this.http.get(`http://localhost:5000/contacto/${id}`);
  }

  //Eliminamos contacto
  public deleteContact(id: string): Observable<any>{
    return this.http.delete(`http://localhost:5000/eliminar/${id}`);
  }

  //Añadimos contacto nuevo
  public addContact(person: Person): Observable<any>{
    return this.http.post(`http://localhost:5000/contacto`, person); 
  }

  //Encontrar el contacto a editar
  findContact(id: string): Observable<any>{
    return this.http.get(`http://localhost:5000/modificar/${id}`)
  }

  //Modificamos contacto
  public editContact(id: string, person: Person): Observable<any>{
    return this.http.put(`http://localhost:5000/modificar/${id}`, person);
  }

}