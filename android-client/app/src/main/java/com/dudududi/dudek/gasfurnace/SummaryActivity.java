package com.dudududi.dudek.gasfurnace;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Color;
import android.icu.util.Calendar;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;

import java.util.Date;

public class SummaryActivity extends AppCompatActivity implements DatePickerDialog.OnDateSetListener {

    private String[] months = new String[] {
            "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"
    };

    private String[] days = new String[] {
            "Pon", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"
    };

    private View loadingView;
    private View selectDateView;
    private CombinedChart dailyChart;
    private RPiWebService webService;
    private Button selectDateButton;
    private boolean isDaily;
    private Date lastSelectedDate;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_summary);

        Intent intent = getIntent();
        isDaily = intent.getBooleanExtra("isDaily", true);

        webService = new RPiWebService();

        selectDateButton = (Button) findViewById(R.id.selectDateButton);
        selectDateView = findViewById(R.id.selectDateView);
        loadingView = findViewById(R.id.loadingViewDaily);
        dailyChart = (CombinedChart) findViewById(R.id.hourly_chart);
        dailyChart.getDescription().setEnabled(false);
        dailyChart.setBackgroundColor(Color.WHITE);
        dailyChart.setDrawGridBackground(false);
        dailyChart.setDrawBarShadow(false);
        dailyChart.setHighlightFullBarEnabled(false);

        // draw bars behind lines
        dailyChart.setDrawOrder(new CombinedChart.DrawOrder[]{
                CombinedChart.DrawOrder.BAR, CombinedChart.DrawOrder.BUBBLE, CombinedChart.DrawOrder.CANDLE, CombinedChart.DrawOrder.LINE, CombinedChart.DrawOrder.SCATTER
        });

        Legend l = dailyChart.getLegend();
        l.setWordWrapEnabled(true);
        l.setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        l.setHorizontalAlignment(Legend.LegendHorizontalAlignment.CENTER);
        l.setOrientation(Legend.LegendOrientation.HORIZONTAL);
        l.setDrawInside(false);

        YAxis rightAxis = dailyChart.getAxisRight();
        rightAxis.setDrawGridLines(false);
        rightAxis.setAxisMinimum(0f); // this replaces setStartAtZero(true)

        YAxis leftAxis = dailyChart.getAxisLeft();
        leftAxis.setDrawGridLines(false);
        leftAxis.setAxisMinimum(0f); // this replaces setStartAtZero(true)

        XAxis xAxis = dailyChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTH_SIDED);
        xAxis.setAxisMinimum(0f);
        xAxis.setGranularity(1f);
        xAxis.setValueFormatter(new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                if (isDaily) {
                    return days[(int) value % days.length];
                } else {
                    return months[(int) value % months.length];
                }
            }
        });

        selectDateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DatePickerDialog datePickerDialog;
                datePickerDialog = new DatePickerDialog(SummaryActivity.this, SummaryActivity.this, 2018, 1, 3);
                datePickerDialog.show();
            }
        });
    }

    @Override
    public void onDateSet(DatePicker datePicker, int year, int month, int day) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, day);
        cal.set(Calendar.DATE, day);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        lastSelectedDate = cal.getTime();
        selectDateView.setVisibility(View.GONE);
        loadingView.setVisibility(View.VISIBLE);
        new LoadDataTask().execute(lastSelectedDate);
    }

    private class LoadDataTask extends AsyncTask<Date, Void, CombinedData> {

        @Override
        protected CombinedData doInBackground(Date... dates) {
            Date date = dates[0];
            return webService.getDailyStatistics(date);
        }

        @Override
        protected void onPostExecute(CombinedData data) {
            loadingView.setVisibility(View.GONE);
            dailyChart.setVisibility(View.VISIBLE);
            dailyChart.setData(data);
            dailyChart.invalidate();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.summary_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.actionRefreshSummary:
                if (selectDateView.getVisibility() != View.VISIBLE) {
                    loadingView.setVisibility(View.VISIBLE);
                    dailyChart.setVisibility(View.GONE);
                    new LoadDataTask().execute(lastSelectedDate);
                }
                break;
            case R.id.actionChangeTime:
                loadingView.setVisibility(View.GONE);
                dailyChart.setVisibility(View.GONE);
                selectDateView.setVisibility(View.VISIBLE);
                break;
            default:
                throw new UnsupportedOperationException("Unsupported item");
        }
        return true;
    }
}
