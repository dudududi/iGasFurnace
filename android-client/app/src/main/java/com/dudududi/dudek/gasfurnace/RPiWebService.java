package com.dudududi.dudek.gasfurnace;

import android.graphics.Color;
import android.util.Log;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.*;
import okhttp3.OkHttpClient;
import okhttp3.Request;

import java.util.ArrayList;
import java.util.Date;

public class RPiWebService {

    private static final String BASE_URL = "http://192.168.2.6:8080/api/";

    private OkHttpClient httpClient;

    public RPiWebService() {
        httpClient = new OkHttpClient();
    }

    public int getCurrentTemperature() {
        sleep();
        //Request request =
        return 20;
    }

    public int getSetTemperature() {
        sleep();
        return 22;
    }

    public boolean getFurnaceState() {
        sleep();
        return false;
    }

    public void setTemperature(int newTemp) {
        sleep();
    }

    private void sleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e){
            Log.e("RPiWebService", "Interrupted.", e);
        }
    }

    public CombinedData getDailyStatistics(Date date) {
        sleep();
        CombinedData combinedData = new CombinedData();
        combinedData.setData(generateLineData(7));
        combinedData.setData(generateBarData(7));
        return combinedData;
    }

    private void getMonthlyStatiscits() {

    }


    //mocks, to be removed
    private LineData generateLineData(int itemcount) {

        LineData d = new LineData();

        ArrayList<Entry> entries = new ArrayList<Entry>();

        for (int index = 0; index < itemcount; index++)
            entries.add(new Entry(index + 0.5f, getRandom(15, 5)));

        LineDataSet set = new LineDataSet(entries, "Zużycie gazu");
        set.setColor(Color.rgb(240, 238, 70));
        set.setLineWidth(2.5f);
        set.setCircleColor(Color.rgb(240, 238, 70));
        set.setCircleRadius(5f);
        set.setFillColor(Color.rgb(240, 238, 70));
        set.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        set.setDrawValues(true);
        set.setValueTextSize(10f);
        set.setValueTextColor(Color.rgb(240, 238, 70));

        set.setAxisDependency(YAxis.AxisDependency.LEFT);
        d.addDataSet(set);

        return d;
    }

    private BarData generateBarData(int itemcount) {

        ArrayList<BarEntry> entries1 = new ArrayList<BarEntry>();
        ArrayList<BarEntry> entries2 = new ArrayList<BarEntry>();

        for (int index = 0; index < itemcount; index++) {
            entries1.add(new BarEntry(0, getRandom(25, 25)));

            entries2.add(new BarEntry(0, getRandom(25, 25)));
        }

        BarDataSet set1 = new BarDataSet(entries1, "Temp zewn.");
        set1.setColor(Color.rgb(60, 220, 78));
        set1.setValueTextColor(Color.rgb(60, 220, 78));
        set1.setValueTextSize(10f);
        set1.setAxisDependency(YAxis.AxisDependency.LEFT);

        BarDataSet set2 = new BarDataSet(entries2, "Temp. wewn.");
        set1.setColor(Color.rgb(23, 197, 255));
        set2.setValueTextColor(Color.rgb(61, 165, 255));
        set2.setValueTextSize(10f);
        set2.setAxisDependency(YAxis.AxisDependency.LEFT);

        float groupSpace = 0.06f;
        float barSpace = 0.02f; // x2 dataset
        float barWidth = 0.45f; // x2 dataset
        // (0.45 + 0.02) * 2 + 0.06 = 1.00 -> interval per "group"

        BarData d = new BarData(set1, set2);
        d.setBarWidth(barWidth);

        // make this BarData object grouped
        d.groupBars(0, groupSpace, barSpace); // start at x = 0

        return d;
    }

    private float getRandom(float range, float startsfrom) {
        return (float) (Math.random() * range) + startsfrom;
    }

}
