<?php
namespace Craft;

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license1.0.html Craft License
 * @link      http://buildwithcraft.com
 */

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_migrationName
 */
class m130215_120000_delete_activity_table extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		$activityTable = $this->dbConnection->schema->getTable('{{activity}}');

		if ($activityTable)
		{
			// Because you can never be TOO careful.
			$this->dropTableIfExists('{{activity}}');

			// Remove it so the auto-updater doesn't choke at the end of this request.
			craft()->log->removeRoute('Craft\\DbLogRoute');
		}
		else
		{
			Craft::log('There is no `activity` table.');
		}
	}
}
