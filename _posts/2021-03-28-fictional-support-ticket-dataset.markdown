---
layout: post
title: Customer support ticket update dataset
date: 2021-03-28 16:15:00 +1100
description: Randomised/fictional customer service support portal dataset in Excel.
img: # /assets/images/?????.jpg no longer works
tags: [dataset, support, ticket, update, Zendesk, Zendesk Explore, agents, photos] # add tag
---

Sample support ticket update, assignment, and agent photos dataset.

You can download or connect to the dataset in Excel format [here](https://github.com/datamesse/excel-support-ticket-update-generator/blob/main/Support_ticket_updates_v2.xlsx?raw=true).

The Github folder with the agent photos can be found [here](https://github.com/datamesse/excel-support-ticket-update-generator/tree/main/agents).

**Update 04/04/2021:** 2nd version of the generator can be downloaded [here](https://github.com/datamesse/excel-support-ticket-update-generator/blob/main/Support_ticket_updates_generator_v2.xlsx?raw=true).

The dataset contains:
 - 5000 support tickets 
 - 67 agents across 8 countries 
 - 1254 end users across 27 countries and 65 cities
 - Date/timestamps are based on Sydney, Australia time (AEST GMT+10/AEDT GMT+11)

The first worksheet "Updates" has the conversational updates for each ticket.
![Support ticket updates](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-03-28-fictional-support-ticket-dataset/01.png?raw=true)

The second worksheet "Assignment" has the ticket open vs ticket assigned date/time data.
**Note:** In Zendesk Explore, ticket assignment is stored as a separate column and in such a way that it doesn't quite combine well with the conversational updates data as a single structure. To mirror that, this separate workheet was created.
![Support ticket assignments](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-03-28-fictional-support-ticket-dataset/02.png?raw=true)

The third worksheet "Agents" has photo IDs that correlate to the images in this [Github folder](https://github.com/datamesse/excel-support-ticket-update-generator/tree/main/agents).

![Support ticket agents](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-03-28-fictional-support-ticket-dataset/03.png?raw=true)

![Support ticket agent photos](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-03-28-fictional-support-ticket-dataset/04.png?raw=true)


**Why this dataset was created**

In my post from [last month](https://datamesse.github.io/blog/2021/02/27/support-ticket-update-times-dataset-generator-in-excel.html), I created an Excel file that randomly generated support ticket update information (e.g. when a end-user opens a ticket, when an agent first replies to the end-user, and the back and forth until the ticket becomes solved). The columns used in the dataset are meant to be similar to those seen in Zendesk Explore and other CRMs that provide reporting on such ticket updates.

I noticed my random generator did not provide realistic fluctuations in the conversation lengths between customer support agents and users, so I spent the better part of this past month reworking the generator to give more variety across the agent statistics. It also didn't account for the ticket IDs being in a realistic sequence, which needs to be amended after extracting the data from the generator.


**Disclaimer**

This dataset is free to use and alter as you need, and no attribution is required, though would be appreciated.

All names in this dataset are fictional and not based on real-life people. The random name generator that was used to create them can be found [here](https://github.com/datamesse/excel-support-ticket-update-generator/blob/main/Random_name_and_business_generator.xlsx?raw=true).

Photographs were taken from [Pixabay.com](https://pixabay.com/service/license/) and [Pexels.com](https://pixabay.com/service/license/) for non-commercial use, edited to fit the appearance of an organisational profile photo, and direct URL attribution included in the dataset for each photo.
