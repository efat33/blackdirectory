import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { EventsAllComponent } from "./all/events-all.component";
import { EventDetailsComponent } from "./details/event-details.component";
import { NewEventComponent } from "./new/new-event.component";
import { AuthVerifiedGuard } from "../shared/route-guards/auth-guard.service";

const routes: Routes = [
  { path: "", redirectTo: "all", pathMatch: "full" },
  { path: "all", component: EventsAllComponent },
  { path: "details/:slug", component: EventDetailsComponent },
  { path: "new", component: NewEventComponent, canActivate: [AuthVerifiedGuard] },
  { path: "edit/:slug", component: NewEventComponent, canActivate: [AuthVerifiedGuard] },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
