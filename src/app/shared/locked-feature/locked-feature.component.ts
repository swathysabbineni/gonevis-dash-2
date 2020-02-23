import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faRocket } from '@fortawesome/free-solid-svg-icons/faRocket';

import { Plan } from './shared/enums/plan';
import { PlanData } from './shared/interfaces/plan-data';

@Component({
  selector: 'app-locked-feature',
  templateUrl: './locked-feature.component.html',
  styleUrls: ['./locked-feature.component.scss'],
})
export class LockedFeatureComponent implements OnInit {

  private static readonly PLAN_DATA: PlanData[] = [{
    plan: Plan.Personal,
    name: 'PERSONAL',
    color: 'warning',
    info: 'PERSONAL_PLAN_FEATURE',
  }, {
    plan: Plan.Professional,
    name: 'PROFESSIONAL',
    color: 'success',
    info: 'PROFESSIONAL_PLAN_FEATURE',
  }];

  @Input() readonly plan: Plan;

  readonly faLocked: IconDefinition = faRocket;
  planData: PlanData;

  ngOnInit(): void {
    this.planData = LockedFeatureComponent.PLAN_DATA.find(item => item.plan === this.plan);
  }
}
