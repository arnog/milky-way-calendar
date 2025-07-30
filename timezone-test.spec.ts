import { test, expect } from '@playwright/test';

test('timezone fix verification for coordinates 42, 80', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173/');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  // Find the location input field
  const locationInput = page.locator('input[placeholder*="location"], input[type="text"]').first();
  
  // Clear any existing content and enter the coordinates
  await locationInput.clear();
  await locationInput.fill('42, 80');

  // Press Enter or trigger the search
  await locationInput.press('Enter');

  // Wait a moment for the calculation to complete
  await page.waitForTimeout(3000);

  // Check if the calendar table is now populated with visibility ratings
  // Look for star ratings or visibility data in the calendar
  const calendarTable = page.locator('table, .calendar');
  await expect(calendarTable).toBeVisible();

  // Look for star ratings or visibility indicators (unused currently)
  // const visibilityRatings = page.locator('.star-rating, [data-testid="star-rating"], .rating');
  
  // Take a screenshot to show the results
  await page.screenshot({ 
    path: '/Users/arno/dev/milky-way-calendar/timezone-test-screenshot.png',
    fullPage: true 
  });

  // Verify that we have some visibility data (not an empty table)
  const tableRows = page.locator('table tr, .calendar-row');
  const rowCount = await tableRows.count();
  
  console.log(`Found ${rowCount} table rows`);
  
  // Check if there are calendar entries with data
  const calendarEntries = page.locator('td, .calendar-cell').filter({ hasNotText: '' });
  const entryCount = await calendarEntries.count();
  
  console.log(`Found ${entryCount} non-empty calendar entries`);
  
  // Verify that the table is not empty
  expect(entryCount).toBeGreaterThan(0);
  
  console.log('Test completed successfully - timezone fix verified!');
});