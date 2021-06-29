import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ListingSearchComponent } from "./listing-search/listing-search.component";
import { ListingDetailsComponent } from "./listing-details/listing-details.component";
import { ListingPlanComponent } from "./listing-plan/listing-plan.component";
import { ListingNewComponent } from "./listing-new/listing-new.component";
import { ListingEditComponent } from "./listing-edit/listing-edit.component";

const routes: Routes = [
  { path: "", redirectTo: "search", pathMatch: "full" },
  { path: "search", component: ListingSearchComponent },
  { path: "plan", component: ListingPlanComponent },
  { path: "new", component: ListingNewComponent },
  { path: ":slug", component: ListingDetailsComponent },
  { path: "edit/:slug", component: ListingEditComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingRoutingModule {}
