package com.dudududi.dudek.gasfurnace;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements AdapterView.OnItemClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setTitle("iGasFurnace");

        List<ContentItem> objects = new ArrayList<>();
        objects.add(new ContentItem("Ustawienia kontrolera", "Ustaw zadaną temperaturę"));
        objects.add(new ContentItem("Podsumowanie dzienne", "Sprawdź zużycie gazu w formie dziennej"));
        objects.add(new ContentItem("Podsumowanie miesięczne", "Sprawdź zużycie gazu w formie miesięcznej"));

        ContentAdapter contentAdapter = new ContentAdapter(this, objects);
        ListView lv = (ListView) findViewById(R.id.listView);
        lv.setAdapter(contentAdapter);

        lv.setOnItemClickListener(this);
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int pos, long l) {
        Intent i;

        switch (pos) {
            case 0:
                i = new Intent(this, ControllerActivity.class);
                break;
            case 1:
                i = new Intent(this, SummaryActivity.class);
                i.putExtra("isDaily", true);
                break;
            case 2:
                i = new Intent(this, SummaryActivity.class);
                i.putExtra("isDaily", false);
                break;
            default:
                throw new UnsupportedOperationException("Unsupported operation");
        }

        startActivity(i);
    }
}
