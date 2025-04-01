package com.eshop.Eshop.model.dto;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TableDto {
    private List<String> headers;
    private List<List<String>> rows;

    public String toHtml() {
        StringBuilder html = new StringBuilder();
        html.append("<table style='border-collapse: collapse; width: 100%;'>");

        // Add headers
        html.append("<thead><tr>");
        for (String header : headers) {
            html.append("<th style='border: 1px solid black; padding: 8px;'>")
                    .append(header)
                    .append("</th>");
        }
        html.append("</tr></thead>");

        // Add rows
        html.append("<tbody>");
        for (List<String> row : rows) {
            html.append("<tr>");
            for (String cell : row) {
                html.append("<td style='border: 1px solid black; padding: 8px;'>")
                        .append(cell)
                        .append("</td>");
            }
            html.append("</tr>");
        }
        html.append("</tbody></table>");

        return html.toString();
    }
}
