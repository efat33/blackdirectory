import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EventRsvpModal } from 'src/app/modals/events/new/event-rsvp/event-rsvp-modal';
import { EventTicketModal } from 'src/app/modals/events/new/event-ticket/event-ticket-modal';
import { NewOrganizerModal } from 'src/app/modals/events/new/new-organizer/new-organizer-modal';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})

export class NewEventComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  hours = [
    { value: '00:00', viewValue: '00:00'},
    { value: '00:15', viewValue: '00:15'},
    { value: '00:30', viewValue: '00:30'},
    { value: '00:45', viewValue: '00:45'},
    { value: '01:00', viewValue: '01:00'},
    { value: '01:15', viewValue: '01:15'},
    { value: '01:30', viewValue: '01:30'},
    { value: '01:45', viewValue: '01:45'},
    { value: '02:00', viewValue: '02:00'},
    { value: '02:15', viewValue: '02:15'},
    { value: '02:30', viewValue: '02:30'},
    { value: '02:45', viewValue: '02:45'},
    { value: '03:00', viewValue: '03:00'},
    { value: '03:15', viewValue: '03:15'},
    { value: '03:30', viewValue: '03:30'},
    { value: '03:45', viewValue: '03:45'},
    { value: '04:00', viewValue: '04:00'},
    { value: '04:15', viewValue: '04:15'},
    { value: '04:30', viewValue: '04:30'},
    { value: '04:45', viewValue: '04:45'},
    { value: '05:00', viewValue: '05:00'},
    { value: '05:15', viewValue: '05:15'},
    { value: '05:30', viewValue: '05:30'},
    { value: '05:45', viewValue: '05:45'},
    { value: '06:00', viewValue: '06:00'},
    { value: '06:15', viewValue: '06:15'},
    { value: '06:30', viewValue: '06:30'},
    { value: '06:45', viewValue: '06:45'},
    { value: '07:00', viewValue: '07:00'},
    { value: '07:15', viewValue: '07:15'},
    { value: '07:30', viewValue: '07:30'},
    { value: '07:45', viewValue: '07:45'},
    { value: '08:00', viewValue: '08:00'},
    { value: '08:15', viewValue: '08:15'},
    { value: '08:30', viewValue: '08:30'},
    { value: '08:45', viewValue: '08:45'},
    { value: '09:00', viewValue: '09:00'},
    { value: '09:15', viewValue: '09:15'},
    { value: '09:30', viewValue: '09:30'},
    { value: '09:45', viewValue: '09:45'},
    { value: '10:00', viewValue: '10:00'},
    { value: '10:15', viewValue: '10:15'},
    { value: '10:30', viewValue: '10:30'},
    { value: '10:45', viewValue: '10:45'},
    { value: '11:00', viewValue: '11:00'},
    { value: '11:15', viewValue: '11:15'},
    { value: '11:30', viewValue: '11:30'},
    { value: '11:45', viewValue: '11:45'},
    { value: '12:00', viewValue: '12:00'},
    { value: '12:15', viewValue: '12:15'},
    { value: '12:30', viewValue: '12:30'},
    { value: '12:45', viewValue: '12:45'},
    { value: '13:00', viewValue: '13:00'},
    { value: '13:15', viewValue: '13:15'},
    { value: '13:30', viewValue: '13:30'},
    { value: '13:45', viewValue: '13:45'},
    { value: '14:00', viewValue: '14:00'},
    { value: '14:15', viewValue: '14:15'},
    { value: '14:30', viewValue: '14:30'},
    { value: '14:45', viewValue: '14:45'},
    { value: '15:00', viewValue: '15:00'},
    { value: '15:15', viewValue: '15:15'},
    { value: '15:30', viewValue: '15:30'},
    { value: '15:45', viewValue: '15:45'},
    { value: '16:00', viewValue: '16:00'},
    { value: '16:15', viewValue: '16:15'},
    { value: '16:30', viewValue: '16:30'},
    { value: '16:45', viewValue: '16:45'},
    { value: '17:00', viewValue: '17:00'},
    { value: '17:15', viewValue: '17:15'},
    { value: '17:30', viewValue: '17:30'},
    { value: '17:45', viewValue: '17:45'},
    { value: '18:00', viewValue: '18:00'},
    { value: '18:15', viewValue: '18:15'},
    { value: '18:30', viewValue: '18:30'},
    { value: '18:45', viewValue: '18:45'},
    { value: '19:00', viewValue: '19:00'},
    { value: '19:15', viewValue: '19:15'},
    { value: '19:30', viewValue: '19:30'},
    { value: '19:45', viewValue: '19:45'},
    { value: '20:00', viewValue: '20:00'},
    { value: '20:15', viewValue: '20:15'},
    { value: '20:30', viewValue: '20:30'},
    { value: '20:45', viewValue: '20:45'},
    { value: '21:00', viewValue: '21:00'},
    { value: '21:15', viewValue: '21:15'},
    { value: '21:30', viewValue: '21:30'},
    { value: '21:45', viewValue: '21:45'},
    { value: '22:00', viewValue: '22:00'},
    { value: '22:15', viewValue: '22:15'},
    { value: '22:30', viewValue: '22:30'},
    { value: '22:45', viewValue: '22:45'},
    { value: '23:00', viewValue: '23:00'},
    { value: '23:15', viewValue: '23:15'},
    { value: '23:30', viewValue: '23:30'},
    { value: '23:45', viewValue: '23:45'},
  ];

  rec_start_monthday = ['1st','2nd','3rd','4th','5th','6th'];

  formDropdown = {
    categories: [
      { value: 1, viewValue: 'Auto, Boat & Air'},
      { value: 2, viewValue: 'Black History'},
      { value: 3, viewValue: 'Charity & Causes'},
      { value: 4, viewValue: 'Networking'},
      { value: 5, viewValue: 'Science & Tech'},
      { value: 6, viewValue: 'Travel & Outdoor'},
    ],
    tags: [
      { value: 1, viewValue: 'Awards'},
      { value: 2, viewValue: 'Ballet'},
      { value: 3, viewValue: 'Classical Music'},
      { value: 4, viewValue: 'Drama'},
      { value: 5, viewValue: 'Investing'},
      { value: 6, viewValue: 'Women Empowerment'},
    ],
    oranizers: [
      { value: 1, viewValue: '10×10 VC'},
      { value: 2, viewValue: 'Daliso Chaponda'},
      { value: 3, viewValue: 'Savoy Theatre'},
      { value: 4, viewValue: 'Ladysmith Black Mambazo'},
      { value: 5, viewValue: 'Micaelia Clarke'},
      { value: 6, viewValue: 'Goethe-Institut London'},
    ]
  };
  

  eventForm: FormGroup;
  showError = false;
  errorMessage = '';

  dialogRefOrganizer: any;
  dialogRefTicket: any;
  dialogRefRsvp: any;

  featuredImageSrc: string;
  removedTickets: any = [];
  removedRsvp: any = [];

  constructor(
    public dialog: MatDialog,
  ) { }


  ngOnInit() {
    this.eventForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      featured_img: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
      tag_id: new FormControl(''),
      address: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      is_virtual: new FormControl(''),
      youtube_url: new FormControl(''),
      website_url: new FormControl(''),

      organizers: new FormArray([
        new FormGroup({
          organizer_id: new FormControl('')
        })
      ]),

      tickets: new FormArray([]),
      rsvp: new FormArray([]),

      event_type: new FormControl('one_time'),
      start_date: new FormControl(''),
      start_time: new FormControl(''),
      end_date: new FormControl(''),
      end_time: new FormControl(''),

      recurrence_type: new FormControl(''),
      recurrence_interval: new FormControl(''),
      days_of_weeks: new FormControl(''),
      months_of_year: new FormControl(''),
      rec_start_date: new FormControl(''),
      rec_start_weekday: new FormControl(''),
      rec_start_monthday: new FormControl(''),
      rec_start_time: new FormControl(''),
      rec_end_date: new FormControl(''),
      rec_end_time: new FormControl(''),
      series_end_type: new FormControl(''),
      series_end_number: new FormControl(''),
      series_end_date: new FormControl(''),


    });

  }


  onSubmit() {
    console.log(this.eventForm.value);
  }



  /**
   * ======================================
   * event rsvp
   * ======================================
   */

  // remove event ticket from Form Array
  removeEventRsvp(index: number, rsvp?: any) {
    (this.eventForm.get('rsvp') as FormArray).removeAt(index); 
    this.removedRsvp.push(rsvp);
  }

   // add / edit ticket of formArray
   addEventRsvp(formData?: any, isEdit?: boolean, index?: number) {
    if(isEdit) {
     const formGroup =  (this.eventForm.get('rsvp') as FormArray).at(index) as FormGroup;
     formGroup.get('id').patchValue(formData.id);
     formGroup.get('title').patchValue(formData.title);
     formGroup.get('capacity').patchValue(formData.capacity);
     formGroup.get('start_sale').patchValue(formData.start_sale);
     formGroup.get('end_sale').patchValue(formData.end_sale);
    }
    else{
     const variationGroup = new FormGroup({
       id: new FormControl(formData.id || ''),
       title: new FormControl(formData.title || ''),
       capacity: new FormControl(formData.capacity || ''),
       start_sale: new FormControl(formData.start_sale || ''),
       end_sale: new FormControl(formData.end_sale || ''),
     });
     (this.eventForm.get('rsvp') as FormArray).push(variationGroup);
    }
   
  }

  // open ticket modal
  openRsvpModal(formdata?: any, index?: number): void {
    this.dialogRefRsvp = this.dialog.open(EventRsvpModal, {
      width: '500px',
      data: { formdata, edit: !!formdata }
    });

    this.dialogRefRsvp.afterClosed().subscribe((result) => {
      if(result) this.addEventRsvp(result, !!formdata, index);
    });

    this.subscriptions.add(this.dialogRefRsvp);

  }

  /**
   * ======================================
   * event ticket
   * ======================================
   */

  // remove event ticket from Form Array
  removeEventTicket(index: number, ticket?: any) {
    (this.eventForm.get('tickets') as FormArray).removeAt(index); 
    this.removedTickets.push(ticket);
  }

   // add / edit ticket of formArray
   addEventTicket(formData?: any, isEdit?: boolean, index?: number) {
    if(isEdit) {
     const formGroup =  (this.eventForm.get('tickets') as FormArray).at(index) as FormGroup;
     formGroup.get('id').patchValue(formData.id);
     formGroup.get('title').patchValue(formData.title);
     formGroup.get('price').patchValue(formData.price);
     formGroup.get('capacity').patchValue(formData.capacity);
     formGroup.get('start_sale').patchValue(formData.start_sale);
     formGroup.get('end_sale').patchValue(formData.end_sale);
    }
    else{
     const variationGroup = new FormGroup({
       id: new FormControl(formData.id || ''),
       title: new FormControl(formData.title || ''),
       price: new FormControl(formData.price || ''),
       capacity: new FormControl(formData.capacity || ''),
       start_sale: new FormControl(formData.start_sale || ''),
       end_sale: new FormControl(formData.end_sale || ''),
     });
     (this.eventForm.get('tickets') as FormArray).push(variationGroup);
    }
   
  }

  // open ticket modal
  openTicketModal(formdata?: any, index?: number): void {
    this.dialogRefTicket = this.dialog.open(EventTicketModal, {
      width: '500px',
      data: { formdata, edit: !!formdata }
    });

    this.dialogRefTicket.afterClosed().subscribe((result) => {
      if(result) this.addEventTicket(result, !!formdata, index);
    });

    this.subscriptions.add(this.dialogRefTicket);

  }

  // open organizer modal
  openOrganizerModal(): void {
    this.dialogRefOrganizer = this.dialog.open(NewOrganizerModal, {
      width: '500px'
    });

    this.dialogRefOrganizer.afterClosed().subscribe((result) => {
      if(result){
        // update organizers array
        this.formDropdown.oranizers.push(result);

        // add field to eventForm organizer
        this.addOrganizerField(result.value);
      }
    });

    this.subscriptions.add(this.dialogRefOrganizer);

  }

  // remove url field from video_urls FormArray
  removeOrganizerField(index: number) {
    (this.eventForm.get('organizers') as FormArray ).removeAt(index); 
  }

  // add more organizer dropdown field
  addOrganizerField(organizer_id?: number) {
    const variationGroup = new FormGroup({
      organizer_id: new FormControl(organizer_id || '')
    });
    (this.eventForm.get('organizers') as FormArray ).push(variationGroup);
  }

  // focus input search field when dropdown clicked
  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  // filter dropdown options
  filteredDropdownOptions(searchString: any, dropdown: string) {
    if (this.formDropdown[dropdown]) {
      return this.formDropdown[dropdown].filter((option) => option.viewValue.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }

  // featured image input change
  onFeaturedImageChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.featuredImageSrc = reader.result as string;
   
      };
   
    }

  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }



}

