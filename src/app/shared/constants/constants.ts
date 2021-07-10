import { Injectable, Injector } from '@angular/core';

export class Constants {
  public static get genericServiceErrorMessage(): string { return "niS Service not accessible" };
  public static get recordAddedMessage(): string { return "Record added successfully." };
  public static get recordDeletedMessage(): string { return "Record deleted successfully." };
  public static get recordDeactivatedMessage(): string { return "Record deactivated successfully." };
  public static get recordActivatedMessage(): string { return "Record activated successfully." };
  public static get recordUnlockedMessage(): string { return "User Unlocked successfully." };
  public static get recordlockedMessage(): string { return "User locked successfully." };
  public static get recordUpdatedMessage(): string { return "Record updated successfully." };
  public static get changePasswordMessage(): string { return "Password changed successfully." };
  public static get setPasswordMessage(): string { return "Password set successfully." };
  public static get sentPasswordMessage(): string { return "Password link sent successfully on email." };
  public static get sentPasswordMailMessage(): string { return "New password sent successfully on user email." };
  public static get msgBoxSuccess(): string { return "success" };
  public static get msgBoxError(): string { return "error" };
  public static get msgBoxWarning(): string { return "warning" };
  public static get actionButtonOk(): string { return "ok" };
  public static get inputMinLenth(): number { return 2 };
  public static get ouShortCodeMaxLenth(): number { return 3 };
  public static get inputMaxLenth(): number { return 50 };
  public static get txtAreaMaxLenth(): number { return 255 };
  public static get characterPattern(): string { return "^[a-zA-Z]+$" };
  public static get numericAlphaSpecialPattern(): string { return "^[A-Za-z0-9_@./#&+-]+$" };
  public static get onlyAlphabetsWithSpaceQuoteHyphen(): string { return "[a-zA-Z-0-9' ]*" };
  public static get onlyAlphabetswithInbetweenSpaceUpto50Characters(): string { return '^[a-zA-Z0-9 ]{0,50}[a-zA-Z0-9]$' };
  public static get onlyCharacterswithInbetweenSpaceUpto50Characters(): string { return '^[a-zA-Z ]{0,50}[a-zA-Z]$' };
  public static get onlyNumbersWithDot(): string { return "[0-9.]*" };
  public static get onlyLetters(): string { return "[a-zA-Z]*" };

  public static get DefaultPageSize(): number { return 0 };
  public static get DefaultPageIndex(): number { return 0 };
  public static get PartitionKey(): string { return 'PartitionKey' };
  public static get Ascending(): number { return 1 };
  public static get Descending(): number { return 2 };
  public static get Contains(): number { return 1 };
  public static get Exact(): number { return 2 };
  public static get UserName(): string { return 'FirstName' };
  public static get Name(): string { return 'Name' };
  public static get UserCode(): string { return 'UserCode' };
  public static get ResourceLoadingFailedMsg(): string { return "Resouce Loading Failed.." };
  public static get EntityName(): string { return "EntityName" };
  public static get smtpTestedMessage(): string { return "Tested Successfully" };
  public static get StartDate(): string { return "StartDate" };
  public static get PagePublishedSuccessfullyMessage(): string { return "Page Published successfully." };
  public static get PageCloneSuccessfullyMessage(): string { return "Page Clone successfully." };
  public static get StatementPublishedSuccessfullyMessage(): string { return "Statement Published successfully." };
  public static get ScheduleReRunSuccessfullyMessage(): string { return "Schedule Re-Run successfully." };
  public static get StatementGeneratedSuccessfullyForSelectedRecordMessage(): string { return "Statement generated successfully for this record." };
  public static get DynamicWidgetPublishedSuccessfullyMessage(): string { return "Dynamic widget published successfully." };
  public static get DynamicWidgetCloneSuccessfullyMessage(): string { return "Dynamic widget clone successfully." };
}

export class ErrorMessageConstants {
  public static get getStartDateLessThanCurrentDateMessage(): string { return "Start Date should be less than current date." };
  public static get getEndDateLessThanCurrentDateMessage(): string { return "End Date should be less than current date." };
  public static get getStartDateLessThanEndDateMessage(): string { return "Start date should be less than end date." };
  public static get getEndDateShouldBeGreaterThanStartDateMessage(): string { return "End date should be greater than start date." };
  public static get getNoRecordFoundMessage(): string { return "No record found." };

  public static get getStartDateThanCurrentDateMessage(): string { return "Start Date should not be less than or equal to current date." };
  public static get getStartDateShouldBeDayAfterTodayOrGreaterThanItMessage(): string { return "Start Date should be day after today or greater than it." };
  public static get getEndDateThanCurrentDateMessage(): string { return "End Date should not be less than or equal to current date." };
  public static get getPreviousEndDateShouldNotBeLessThanEndDateMessage(): string { return "End date should not be less than previous end date." };
  public static get getStartDateAndEndDateShouldhaveMonthDifferenceMessage(): string { return "Start date and end date should have minimum one month difference." };
  public static get getSomethingWentWrongErrorMessage(): string { return "Something went wrong, Please contact Administrator." };
  
  public static get getProcurementDateLessThanCurrentDateMessage(): string { return "Procurement Date should be less than current date." };
}

@Injectable()
export class DynamicGlobalVariable {
  public IsSessionExpireMessageDisplyed: boolean = false;
}
