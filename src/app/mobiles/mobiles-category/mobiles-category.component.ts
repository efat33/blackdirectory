import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { LoginModal } from 'src/app/modals/user/login/login-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { MobilesService } from '../mobiles.service';
import * as lodash from 'lodash';

@Component({
  selector: 'app-mobiles-category',
  templateUrl: './mobiles-category.component.html',
  styleUrls: ['./mobiles-category.component.scss'],
})
export class MobilesCategoryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  filterForm: FormGroup;

  mobileCategory: string;
  categoryName: string;

  mobiles: any[];
  topMobile: any;

  providers: any[] = [];
  selectedProviders: any[] = [];

  contracts: any[] = [];
  selectedContracts: any[] = [];

  unlimitedData: boolean = false;
  unlimitedMinutes: boolean = false;
  unlimitedTexts: boolean = false;
  orderBy: string;

  costsSliderConfig = {
    connect: true,
    step: 1,
    range: {
      min: 0,
      max: 50,
    },
  };

  dataSliderConfig = {
    snap: true,
    connect: true,
    range: {
      min: 0,
      '5%': 1,
      '10%': 2,
      '15%': 3,
      '20%': 4,
      '25%': 5,
      '30%': 6,
      '35%': 8,
      '40%': 10,
      '45%': 11,
      '50%': 15,
      '55%': 18,
      '60%': 20,
      '65%': 30,
      '70%': 50,
      '75%': 60,
      '80%': 100,
      '85%': 120,
      '90%': 150,
      '95%': 250,
      max: this.mobilesService.unlimitedNumber,
    },
  };

  minutesAndTextsSliderConfig = {
    snap: true,
    connect: true,
    range: {
      min: 0,
      '20%': 500,
      '40%': 1000,
      '60%': 2000,
      '80%': 5000,
      max: this.mobilesService.unlimitedNumber,
    },
  };

  totalItems = 200;
  currentPage = 1;
  pageSize = 12;

  // convenience getter for easy access to form fields
  get f() {
    return this.filterForm?.controls;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mobilesService: MobilesService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService
  ) {
    this.route.params.subscribe((params) => {
      this.initialize();
      this.getTopMobiles();
    });
  }

  ngOnInit() {}

  initialize() {
    this.mobileCategory = this.route.snapshot.paramMap.get('cat-slug');
    const category = this.mobilesService.categories.find((category: any) => category.value === this.mobileCategory);

    if (!category) {
      this.router.navigate(['home']);
      return;
    }

    this.categoryName = category.title;

    this.initializeFilterForm();

    this.getTotalMobiles();
    this.getMobiles();

    this.getProviders();
  }

  getTopMobiles() {
    this.spinnerService.show();
    const subscription = this.mobilesService.getTopMobiles().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.topMobile = result.data.find((mobile: any) => mobile.category === this.mobileCategory);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  initializeFilterForm() {
    this.filterForm = new FormGroup({
      cost: new FormControl([0, 50]),
      data: new FormControl([0, this.mobilesService.unlimitedNumber]),
      minutes: new FormControl([0, this.mobilesService.unlimitedNumber]),
      texts: new FormControl([0, this.mobilesService.unlimitedNumber]),
    });
  }

  getTotalMobiles() {
    const params = this.getFilterValues();

    this.spinnerService.show();
    const subscription = this.mobilesService.getMobiles(params).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.totalItems = result.data?.length || 0;

        if (this.contracts.length === 0) {
          // first load
          this.generateContracts(result.data);
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getMobiles(page: number = 1) {
    const params = this.getFilterValues();

    params.page = page;
    params.limit = this.pageSize;

    this.spinnerService.show();
    const subscription = this.mobilesService.getMobiles(params).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.mobiles = result.data;
        this.currentPage = page;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getProviders() {
    this.spinnerService.show();
    const subscription = this.mobilesService.getMobileProviders().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.providers = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  generateContracts(mobiles: any) {
    this.contracts = mobiles
      .map((mobile: any) => mobile.contract_length)
      .filter((value: any, index: number, array: any) => array.indexOf(value) === index && value > 0)
      .sort((a: number, b: number) => a - b);

    this.selectedContracts = ['any'];
  }

  isUnlimited(value: any) {
    return value === this.mobilesService.unlimitedNumber;
  }

  onFilter() {
    this.getTotalMobiles();
    this.getMobiles();
  }

  getFilterValues() {
    const values = lodash.cloneDeep(this.filterForm.value);
    values.providers = this.selectedProviders;
    values.contracts = this.selectedContracts;

    if (this.unlimitedData) {
      values.data[0] = this.mobilesService.unlimitedNumber;
    }

    if (this.unlimitedMinutes) {
      values.minutes[0] = this.mobilesService.unlimitedNumber;
    }

    if (this.unlimitedTexts) {
      values.texts[0] = this.mobilesService.unlimitedNumber;
    }

    if (this.orderBy) {
      values.orderBy = this.orderBy;
    }

    values.category = this.mobileCategory;

    return values;
  }

  onClickProvider(provider: any) {
    if (this.selectedProviders.includes(provider.id)) {
      this.selectedProviders = this.selectedProviders.filter((id) => id !== provider.id);
    } else {
      this.selectedProviders.push(provider.id);
    }

    this.onFilter();
  }

  onChangeContract(selectedContract: any) {
    if (selectedContract === 'any') {
      this.selectedContracts = ['any'];
      this.onFilter();

      return;
    }

    this.selectedContracts = this.selectedContracts.filter((contract: any) => contract !== 'any');

    if (this.selectedContracts.includes(selectedContract)) {
      this.selectedContracts = this.selectedContracts.filter((contract: any) => contract !== selectedContract);
    } else {
      this.selectedContracts.push(selectedContract);
    }

    if (this.selectedContracts.length === 0) {
      this.selectedContracts = ['any'];
    }

    this.onFilter();
  }

  onChangeOrderBy(value: string) {
    this.orderBy = value;

    this.getMobiles();
  }

  onPageChange(newPage: number) {
    this.getMobiles(newPage);
  }

  formatCost(cost: string) {
    return parseFloat(parseFloat(cost).toFixed(2));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
