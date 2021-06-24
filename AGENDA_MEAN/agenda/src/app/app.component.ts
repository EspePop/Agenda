import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Person } from '../app/models/person';
import { RestService } from './services/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{ 

  selectedPerson: Person = new Person();

  contacts: Person[] = [];

  genders = [
    { id: 'Mujer', value: 'Mujer' },
    { id: 'Hombre', value: 'Hombre' },
    { id: 'Otro', value: 'Otro' },
    { id: 'No especificado', value: 'No especificado' }
  ];

  contactForm = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    age: new FormControl('', [Validators.required, Validators.min(0), Validators.max(125)]),
    dni: new FormControl('', [Validators.required, Validators.pattern('[0-9]{8}[a-zA-z]{1}')]),
    birthday: new FormControl('', Validators.required),
    color: new FormControl('', [Validators.required, Validators.minLength(3)]),
    gender: new FormControl('', Validators.required)
  });

  constructor(private restService: RestService){  }

  ngOnInit() : void { 
    this.getContacts();
  }

  //Consultamos todos los contactos
  getContacts(){
    this.restService.getAll().subscribe(data => {
      this.contacts = data; 
    }, error => {
      window.alert(`No podemos consultar tu agenda porque ${error}`);
      console.log(error);
      
    });
  }

  //Consultamos un contacto
  getOneContact(){
    this.restService.getContact(this.selectedPerson._id).subscribe(data =>{
      this.selectedPerson = data;
    }, error => {
      window.alert(`No podemos consultar tu contacto porque ${error}`);
      console.log(error);
    });
  }

  //Comenzamos a editar si seleccionamos contacto de la agenda
  startEdit(person: Person){
    this.selectedPerson = person;    
  }

  //Una vez seleccionado podemos añadir, modificar, eliminar
  insertOrEdit(){

    if(!this.contactForm.valid){
      //El formulario debe cumplir las validaciones
      alert('¡Cuidadín! Please, rellena el formulario para añadir un contacto');    
    } //CREAR CONTACTO 
    else if(this.selectedPerson._id === null){  
      //Si no existe el contacto me lo creas
      this.restService.addContact(this.selectedPerson).subscribe(data => {
        window.alert(`${this.selectedPerson.name} se ha añadido a tu agenda`);
        this.getContacts();
      }, error => {
        window.alert(`No podemos añadir tu contacto porque ${error}`);
        console.log(error);
      });  
    } //MODIFICAR CONTACTO
    else if(this.selectedPerson._id != null){
      //Pero si existe lo podemos modificar
      this.restService.editContact(this.selectedPerson._id, this.selectedPerson).subscribe(data =>{
        window.alert(`Los datos de ${this.selectedPerson.name} se han modificado`);
        this.selectedPerson = new Person();
      }, error => {
        window.alert(`No podemos modificar tu contacto porque ${error}`);
        console.log(error);
      });
    }      
    this.restService.findContact(this.selectedPerson._id).subscribe(data => {
      this.contactForm.setValue({
        _id: data._id,
        name: data.name,
        lastname: data.lastname,
        age: data.age,
        dni: data.dni,
        birthday: data.birthday,
        color: data.color,
        gender: data.gender
      });
      this.selectedPerson = new Person();
    });      
   }
   
   //ELIMINAR CONTACTO
   deleteContact(id: string){
    if(confirm(`Vas a eliminar a ${this.selectedPerson.name}, ¿estás segur@?`)){
      this.restService.deleteContact(id).subscribe(data => {
        window.alert(`Ya no podrás contactar con ${this.selectedPerson.name}`);
        this.contactForm.reset();
        this.getContacts();
      } , error => {
        window.alert(`No podemos eliminar tu contacto porque ${error}`);
        console.log(error);        
      });      
    }
  }   
}
