/**
 * Represents a single transaction information structure such as: Transaction pay date, transaction ID and amount of it
 * This is being used at billing page
 *
 * @link SettingsBillingComponent
 */
export interface Transaction {
  created: string;
  id: string;
  total: string;
}
