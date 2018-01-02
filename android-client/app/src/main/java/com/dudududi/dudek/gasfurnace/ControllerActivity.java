package com.dudududi.dudek.gasfurnace;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.shawnlin.numberpicker.NumberPicker;

public class ControllerActivity extends AppCompatActivity {

    private View loadingView;
    private View controllerView;
    private RPiWebService webService;

    private TextView currentTemperatureLabel;
    private NumberPicker setTemperatureLabel;
    private TextView furnaceStateLabel;
    private Button updateTemperatureButton;
    private ProgressBar updateTemperatureProgressBar;
    private int lastSetTemperature;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_controller);
        loadingView = findViewById(R.id.loadingView);
        controllerView = findViewById(R.id.controllerView);
        currentTemperatureLabel = (TextView) findViewById(R.id.activity_controller_current_temperature_value);
        setTemperatureLabel = (NumberPicker) findViewById(R.id.activity_controller_set_temperature_value);
        furnaceStateLabel = (TextView) findViewById(R.id.activity_controller_furnace_state_value);
        updateTemperatureButton = (Button) findViewById(R.id.activity_controller_update_set_temperature);
        updateTemperatureProgressBar = (ProgressBar) findViewById(R.id.activity_controller_updating_temperature);
        webService = new RPiWebService();

        setTemperatureLabel.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
            @Override
            public void onValueChange(NumberPicker picker, int oldVal, int newVal) {
                if (newVal != lastSetTemperature) {
                    updateTemperatureButton.setVisibility(View.VISIBLE);
                } else {
                    updateTemperatureButton.setVisibility(View.GONE);
                }
            }
        });

        updateTemperatureButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                updateTemperatureButton.setVisibility(View.GONE);
                updateTemperatureProgressBar.setVisibility(View.VISIBLE);
                new UpdateTemperatureTask().execute(setTemperatureLabel.getValue());
            }
        });

        new GetDataTask().execute();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.controller_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.actionRefresh) {
            controllerView.setVisibility(View.GONE);
            loadingView.setVisibility(View.VISIBLE);
            new GetDataTask().execute();
        }
        return true;
    }


    private class GetDataTask extends AsyncTask<Void, Void, GetDataTask.Results> {

        @Override
        protected Results doInBackground(Void... voids) {
            Results results = new Results();
            results.currentTemperature = webService.getCurrentTemperature();
            results.setTemperature = webService.getSetTemperature();
            results.furnaceState = webService.getFurnaceState();
            return results;
        }

        @Override
        protected void onPostExecute(Results result) {
            loadingView.setVisibility(View.GONE);
            controllerView.setVisibility(View.VISIBLE);
            currentTemperatureLabel.setText(String.format(getString(R.string.activity_controller_current_temperature_value), result.currentTemperature));
            setTemperatureLabel.setValue(result.setTemperature);
            furnaceStateLabel.setText(getString(result.furnaceState ? R.string.activity_controller_furnace_state_on_value : R.string.activity_controller_furnace_state_off_value));
            lastSetTemperature = result.setTemperature;
        }

        class Results {
            private int currentTemperature;
            private int setTemperature;
            private boolean furnaceState;
        }
    }

    private class UpdateTemperatureTask extends AsyncTask<Integer, Void, Void> {

        @Override
        protected Void doInBackground(Integer... ints) {
            int newTemp = ints[0];
            webService.setTemperature(newTemp);
            lastSetTemperature = newTemp;
            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            updateTemperatureProgressBar.setVisibility(View.GONE);
        }
    }

}
