---
layout: post
title: Customer support ticket update generator
date: 2021-02-27 19:50:00 +1100
description: Using Excel to create a dataset generator
img: # /assets/images/?????.jpg no longer works
tags: [Excel, formula, support ticket, Zendesk Explore, dataset, dataset generator, RANDBETWEEN, random] # add tag
---

Randomised support ticket update date/time dataset generator made using Excel.

This dataset generator is free-to-use and targeted for anyone wanting to create data dashboards based on response times between support agents and end users. Please note this is a makeshift template using vlookups and randomisation, so what it creates is minimal and still requires some manual intervention.

You can find my GitHub repository for the generator [here](https://github.com/datamesse/excel-support-ticket-update-generator).

![Random support ticket update dataset generator](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/01.png?raw=true)

You can download a sample dataset created by this generator [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Support_ticket_updates.xlsx?raw=true).

Current generator support:
* Specify date range covered by the entire dataset.
* Ticket open/creation time is randomly selected between client's approximate local standard 9am and 5pm.
* No absolute restriction on when tickets responded to by staff.
* Support ticket assignment date/time (on a separate worksheet).
* Ticket priority supported as of 06/03/2021.
* Solved updates included as of 06/03/2021.
* Define probability of ticket criticality by country as of 19/04/2021.
* Define probability of development escalation by country as of 19/04/2021.
* Minimise likelihood update record is on a weekend, Christmas, and New Year's days as of 03/05/2021.

Current generator limitations:
* No integration between person/business randomiser, i.e. data needs to be copied from one Excel file to the other.
* Limited restriction date in terms of forcing it to be a weekday when tickets raised or responded to.
* Limited number of cities and countries in output, but can be expanded on manually.
* Fixed number of records: 29,500 across 5000 tickets, but can be expanded on manually.

The above limitations should be fine, as I have seen plenty of cases where end users raise tickets at their midnight on weeknights, and on their weekends. Similarly for staff, it is not uncommon to respond outside their office times.

This post provides an overview on how I created this dataset generator over the last 2 weeks, and how to use it.

There are several steps to use this dataset generator:
1. Specify date range for the dataset (download [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Support_ticket_updates_generator.xlsx?raw=true)).
2. Create staff members and client end users using the random person and business generator (download [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Random_name_and_business_generator.xlsx?raw=true)).
3. Populate the support ticket updates dataset generator with those staff and clients.
4. Add or remove rows to change number of tickets, and add or remove sheets to increase ticket communication trails.


**Define dataset start and end date**

Download the first Excel file to create the dataset from [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Support_ticket_updates_generator.xlsx?raw=true), then populate the *Main* worksheet with the desired start and end dates.

![Random name generator worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/02.png?raw=true)


**Create staff and end users**

A secondary Excel file that randomly creates people's names, company, and work emails, using a pre-populated list of given names, surnames, and common words used in business names.

You can download a copy of the random person generator Excel file [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Random_name_and_business_generator.xlsx?raw=true).

The final output is provided in the *Random name generator* worksheet.

![Random name generator worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/03.png?raw=true)

If you only want to produce random business names, you can use the *Random business generator* worksheet.

![Random business generator worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/04.png?raw=true)

To edit what names or words are used to randomly create the data, refer to the following worksheets:
- *GivenName*
- *Surname*
![GivenName and Surname worksheets](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/05.png?raw=true)
- *Business Part 1* - For the first word in the company name
- *Business Part 2* - For the second word in the company name
![Business Part 1 and Business Part 2 worksheets](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/06.png?raw=true)

The list of given names and surnames is populated and merged from a variety of sources, but predominantly from [https://www.behindthename.com/](https://www.behindthename.com/).

As you'll find, the vast majority of randomisation depends on Excel's RANDBETWEEN function, which by default and set by the workbook, automatically refreshes upon Excel interface changes. So it's important to copy out the data as values to a separate file, if looking to persist it.

The 3 main limitations of this random person generator are:
1. The strong chance of the same given name or surname being repeated, i.e. risk of reduced diversity. So it is recommended that after you remove records that might be in excess.
For example, having too many Adams in your dataset:
![Random name generator with multiple Adam given name records](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/07.png?raw=true)
2. No control over the number of users belonging to a single company, i.e. if looking to create a certain number of people per company, you would need to manually apply that business name across the additional people required. For the purposes of the support ticket update generator, as is, it does not use business names nor emails.
3. Limited number of country / state / city values supported. The random person generator and random support ticket update generator share the same country, state, and city information. If you need extra cities added, you will need to update both generators. For the random person generator, you only need to update those location fields under the *Location* worksheet.

![Random name generator's Location worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/08.png?raw=true)

For the support ticket update generator, the location fields are in the *Userzone* worksheet. The Timezone column can be left blank, as it is being used to correlate to the timezone anchor dataset from a previous [post](https://datamesse.github.io/blog/2021/01/23/import-time-zone-offsets-and-observation-anchors-from-wikipedia.html). The Office start and end columns are the approximate 9am and 5pm office hour times for that city relative to Sydney AEST, and are mandatory for the timestamp randomiser to work. The Office mark column uses arbitrary numbering to group cities in terms of their office hours falling into the same time zone.

![Random support ticket update generator's Userzone worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/09.png?raw=true)


**Populate ticket updates dataset generator**

After cleaning out the names you would like to use, copy the Full name, Country, State, and City column values (not the column headers) to the *Staff* and *Client* worksheets to the support ticket update generator. Be mindful not to copy across Gender, as that wasn't factored into the ticket update generator, along with business, email, etc.

![Copy randomised names to Staff worksheet of update generator](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/10.png?raw=true)

![Copy randomised names to Client worksheet of update generator](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/11.png?raw=true)

Then go to the *Combined* worksheet, and copy out the results as values to another Excel file.

The End-user updates, Public comments, and Internal comments columns are binary columns.
* End-user updates: value is 1 if the update is by an End-user, 0 if by a staff member.
* Public comments: value is 1 if a public comment by either an End-user or staff member.
* Internal comments: value is 1 if the update is an internal comment by a staff member.

![Copy out data from Combined worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/12.png?raw=true)

There is also an *Assigned* worksheet, which randomises the time the support agent picks up the ticket from between when it is raised and the agent's first response.
Be carefult to make sure you are not editing the workbook in any way between copying out the data between both worksheets, otherwise Excel's auto-recalculation will cause a completely different set of data to appear.

![Copy out data from Assignment worksheet](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/13.png?raw=true)



**How it works**

The *Combined* worksheet combines the output of 7 other worksheets, *Updates 1*, *Updates 2*, *Updates 3*, etc.

Each of the *Updates* worksheets has a fixed number of records, so if you need to adjust the number of records in any one of the sheets, then you will need to adjust the *Combined* sheet.

To show the reason for this, as an example, *Updates 1* records the opening of new tickets, and has 5000 rows.
![Updates 1 worksheet at last record](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/14.png?raw=true)

The *Combined* worksheet references the Ticket ID from *Updates 1*. Then a manual process of clicking and dragging down the rows in *Combined* to account for those 5000 rows (ignoring the headers).
![Combined worksheet at 5000th record](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/15.png?raw=true)

But moving to the 5001st row, the Ticket ID from from *Updates 2* is used. This manual process is rinse-and-repeated for each subsequent *Updates* worksheet relative to the number of records they have. This also means the formulas in the *Combined* worksheet will always be inconsistent.
![Combined worksheet at 5001st record](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-27-support-ticket-update-times-dataset-generator-in-excel/16.png?raw=true)

The list below indicates the nature of the data that each worksheet covers:
* *Updates 1* - The first email that an End-user sends to the support portal to create the support ticket. Each row represents a unique support ticket ID.

* *Updates 2* - The first response by a randomised staff Agent, with 90% chance the Agent is also the Assignee. Every Ticket ID from *Updates 1* are responded to.

* *Updates 3* - The second email by the End-user. 4500 out of 5000 (90%) Ticket IDs from *Updates 2* are responded to.

* *Updates 4* - The second email by the Agent (original Assignee only). 4000 out of 4500 Ticket IDs from *Updates 3* are responded to (80% overall tickets).

* *Updates 5* - The third email by the End-user. 3500 out of 4000 Ticket IDs from *Updates 4* are responded to (70% overall tickets).

* *Updates 6* - Internal comment (i.e. non-public-facing message) by Assignee with random change to Update ticket status column (Open 60%, Pending 20%, and Hold 20%. Randomly applied to 1000 out of 5000 Ticket IDs, with possibility for repeated ID reference.

* *Updates 7* - Public comment by a randomised End-user to Update ticket status column. Randomly applied to 1500 out of 5000 Ticket IDs, with possibility for repeated ID reference.

* *Updates 8* - Final update by the Agent to close support ticket. Randomised as being either an internal comment, public email back to End User or no response at all, newly added as of 06/03/2021.

If you have any questions, please feel free to DM or tweet out to me on Twitter.

Happy dashboarding!
