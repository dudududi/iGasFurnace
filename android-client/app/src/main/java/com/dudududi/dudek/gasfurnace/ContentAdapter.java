package com.dudududi.dudek.gasfurnace;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

public class ContentAdapter extends ArrayAdapter<ContentItem> {

    public ContentAdapter(Context context, List<ContentItem> objects) {
        super(context, 0, objects);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        ContentItem c = getItem(position);

        ViewHolder holder = null;

        if (convertView == null) {

            holder = new ViewHolder();

            convertView = LayoutInflater.from(getContext()).inflate(R.layout.list_item, null);
            holder.tvName = convertView.findViewById(R.id.tvName);
            holder.tvDesc = convertView.findViewById(R.id.tvDesc);
            holder.tvNew = convertView.findViewById(R.id.tvNew);

            convertView.setTag(holder);

        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        holder.tvName.setText(c.name);
        holder.tvDesc.setText(c.desc);

        if(c.isNew)
            holder.tvNew.setVisibility(View.VISIBLE);
        else
            holder.tvNew.setVisibility(View.GONE);

        return convertView;
    }

    private class ViewHolder {

        TextView tvName, tvDesc;
        TextView tvNew;
    }
}
