import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-delete-trip',
  templateUrl: './delete-trip.component.html',
  styleUrls: ['./delete-trip.component.css']
})
export class DeleteTripComponent implements OnInit {

  tripCode:String;
  deleteForm:FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { 
    this.tripCode = "";
    this.deleteForm = formBuilder.group({
      title: formBuilder.control('initial value', Validators.required)
  });
  }

  ngOnInit() {
    // retrieve stashed tripId
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('DeleteTripComponent#onInit found tripCode ' + tripCode);

    // initialize form
    this.deleteForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required]
    })
    console.log('DeleteTripComponent#onInit calling TripDataService#getTrip(\'' + tripCode + '\')');
    this.tripService.getTrip(tripCode)
      .then(data => {
        console.log(data);
        // Don't use editForm.setValue() as it will throw console error
        this.deleteForm.patchValue(data);
    })
  }

   onSubmit() {
    if (this.deleteForm.valid) {
      this.tripService.deleteTrip(this.deleteForm.value)
        .then(data => {
          console.log(data);
          this.router.navigate(['']);
      });
    }
  }

  get f() {
    return this.deleteForm.controls;
  }
}