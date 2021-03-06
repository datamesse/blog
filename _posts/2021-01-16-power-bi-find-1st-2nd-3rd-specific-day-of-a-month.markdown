---
layout: post
title: Power BI find date for the nth specific day of a month
date: 2021-01-16 19:20:00 +1100
description: Using Power Query in Power BI to find the first, second, third or fourth specific day e.g. Sunday of a month/year, based on another date column. # Add post description (optional)
img: # /assets/images/?????.jpg no longer works
tags: [Power BI, Power Query, M, Date.DayOfWeek,] # add tag
---

Using Power Query in Power BI to find the date of the relative weekday for a given month and year.


This may be required for the conditional logic of other Custom Columns. For example, to create indicators that data rows occur on or fall between relative date ranges e.g. Black Friday sales. The following involves adding a Custom Column in Power Query i.e. M code, not DAX.

Finds the first Monday of the month, where our dependent date column is OurDateField.

```
Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/" & Text.From((7 - (Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Monday)))))
```

![Power Query: 1st Sunday of month](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/1.png?raw=true)

**How it works**

To find the first Sunday of a specific month/year relative to another date, first establish the start of the month e.g. 1/10 (1st October), passing in the date field you are using e.g. [OurDateField], to append its year.

```
Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1")
```

 In this example, we are hard-coding October regardless of OurDateField’s month value, but if you need it to be relative to its month too, simply add an extra concatenation for month in the same way year is treated, i.e. using Date.Month().

Now we need to identify what day of the week that this first day of the month is, using Date.DayOfWeek, and setting the optional parameter for what the start of the week is, as Day.Monday

```
Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Monday)
```

![Power Query: Day of week number](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/2.png?raw=true)

 
In this example, 1st October 2021 is a Friday, and Friday’s day number is 4 (with Monday being 0).

![Calendar: Weekday of 1st day of month](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/3.png?raw=true)

If you do not provide the Day.Monday parameter, it will default to Day.Monday in the background. If another parameter is used e.g. Day.Sunday, then the assignment numbers will change.

Now we subtract the weekday number 4 from 7, and get 3, which is the first Sunday’s date.

```
7 - (Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Monday))
```

![Power Query: Date of 1st Sunday](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/4.png?raw=true)

Then concatenate this with the year month retrieved earlier

```
Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/" & Text.From((7 - (Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Monday)))))
```

![Power Query: Concatenate the month year to the date](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/5.png?raw=true)

If you need to change the weekday that Power Query needs to find, simply increment the Day.Monday parameter to the following day of the desired weekday.

For example, if you want to find the first Wednesday, change the parameter to Day.Thursday.

```
Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/" & Text.From((7 - (Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Thursday)))))
```

![Power Query: 1st Wednesday of month](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/6.png?raw=true)

![Calendar: 1st Wednesday of the month](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/7.png?raw=true)

If you need to change the position from first, to second, third, or fourth Sunday, simply add 7 for the second, 14 for the third, and 21 for the fourth.

For example, we will retrieve the 3rd Sunday.

```
Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/" & Text.From((7 - (Date.DayOfWeek(Date.FromText(Text.From(Date.Year([OurDateField])) & "/10/1"),Day.Monday)) + 14 )))
```

![Calendar: 3rd Sunday of the month](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-16-power-bi-find-1st-2nd-3rd-specific-day-of-a-month/8.png?raw=true)


Hope this helps!
