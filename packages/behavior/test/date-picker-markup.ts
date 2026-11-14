/** The date picker markup the Alpine tests mount, as the Blade component renders it. */

/** `options` is the x-data argument. */
export const markup = (options = "{ locale: 'en-US' }", { range = false, time = false } = {}) => `
<div id="dp" x-data="apuiDatePicker(${options})" x-apui:root>
  <label id="dp-label" x-apui:label>Move-in date</label>
  <div id="dp-control" x-apui:box>
    <button id="dp-trigger" x-apui:trigger>📅</button>
    <input id="dp-input" x-apui:control="{ index: 0 }" />
    ${range ? '<span>–</span><input id="dp-input-1" x-apui:control="{ index: 1 }" aria-label="End date" />' : ''}
  </div>
  <div id="dp-positioner" x-apui:positioner wire:ignore>
    <div id="dp-content" x-apui:content>
      <div x-apui:view-control>
        <button id="dp-prev" x-apui:prev-trigger>‹</button>
        <span x-apui:range-text x-text="monthLabel"></span>
        <button id="dp-next" x-apui:next-trigger>›</button>
      </div>
      <table id="dp-table" x-apui:table>
        <thead x-apui:table-head>
          <tr x-apui:table-row>
            <template x-for="(weekDay, w) in weekDays" :key="w">
              <th x-apui:table-header :abbr="weekDay.long" x-text="weekDay.short"></th>
            </template>
          </tr>
        </thead>
        <tbody x-apui:table-body>
          <template x-for="(week, r) in weeks" :key="r">
            <tr x-apui:table-row>
              <template x-for="day in week" :key="day.iso">
                <td x-apui:table-cell="{ value: day.iso }">
                  <div x-apui:table-cell-trigger="{ value: day.iso }" x-text="day.day"></div>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
      ${
        time
          ? `<div id="dp-times" x-apui:time-list>
        <template x-for="option in times" :key="option.value">
          <div x-apui:time-option="{ value: option.value }" x-text="option.label"></div>
        </template>
      </div>`
          : ''
      }
    </div>
  </div>
</div>`;
