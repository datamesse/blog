---
layout: post
title: Find date for the last specific day of a month
date: 2021-01-30 12:42:00 +1100
description: Using Power Query in Power BI to find the last specific day e.g. last Sunday of a month/year, based on another date column. # Add post description (optional)
img: # /assets/images/?????.jpg no longer works
tags: [Power BI, Power Query, M, Date.EndOfMonth,] # add tag
---

Using Power Query in Power BI to find the date of the last relative weekday for a given month and year.

This is a continuation of a [previous post](https://datamesse.github.io/blog/2021/01/16/power-bi-find-1st-2nd-3rd-specific-day-of-a-month.html) which retrieved the 1st, 2nd, 3rd, or 4th specified day of a month. If the last occurrence of a specific day in a month needs to be retrieved, it can possibly be the 4th or 5th instance of that day. Retrieving this may be required for conditional or other custom column dependencies.

Finds the last Sunday of the month, where our dependent date column is OurDateField.

```
Date.AddDays(Date.EndOfMonth([OurDateField]),(-1 * Number.From(Date.DayOfWeek(Date.EndOfMonth([OurDateField]), Day.Sunday))))
```
![Power Query Day number of last of the month year Day.Sunday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/04.png?raw=true)

**How it works**

Following similar logic to the previous post, we will try to retrieve the last Sunday of a specific month/year, passing in our relative *OurDateField*.

```
Date.EndOfMonth([OurDateField])
```
![Power Query last day of the month year](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/01.png?raw=true)

Then find out which day of the week it is.

```
Date.DayOfWeek(Date.EndOfMonth([OurDateField]), Day.Monday)
```
![Power Query Day number of last of the month year Day.Monday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/02.png?raw=true)

In this example, 31st January 2021 is a Sunday, and Sunday’s day number is 6. This is if the optional parameter for start of the week is Day.Monday (which is the default, if not provided).

![Calendar using Day.Monday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/03.png?raw=true)

Now we will swap that Day.Monday parameter out with Day.Sunday, so that the value for Sunday becomes 0 instead of 6.

```
Date.DayOfWeek(Date.EndOfMonth([OurDateField]), Day.Sunday)
```
![Power Query Day number of last of the month year Day.Sunday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/04.png?raw=true)

![Calendar using Day.Sunday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/05.png?raw=true)

We then minus this number from the last date of the month, to get the last Sunday of the month, whih ironically is the same day i.e. Sunday 31/01/2021 - 0 = 31/01/2021. We do this using the Date.AddDays function and multiplying the number with -1.

```
Date.AddDays(Date.EndOfMonth([OurDateField]),(-1 * Number.From(Date.DayOfWeek(Date.EndOfMonth([OurDateField]), Day.Sunday))))
```
![Power Query last date Sunday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/06.png?raw=true)

Lastly, if you need to pick any other last specific day of the month, just increment by one for each day you want to go earlier in the week e.g. Saturday is +1, Friday is +2 etc.

For example, the last Friday of the month year.

```
Date.AddDays(Date.EndOfMonth([OurDateField]),(-1 * (Number.From(Date.DayOfWeek(Date.EndOfMonth([OurDateField]), Day.Sunday)) + 2)))
```
![Power Query last date Friday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/07.png?raw=true)

![Power Query last date Friday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-30-power-bi-find-last-specific-day-of-a-month/08.png?raw=true)
