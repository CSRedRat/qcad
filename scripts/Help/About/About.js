/**
 * Copyright (c) 2011-2013 by Andrew Mustun. All rights reserved.
 * 
 * This file is part of the QCAD project.
 *
 * QCAD is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * QCAD is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with QCAD.
 */

include("../Help.js");
 

function About(guiAction) {
    Help.call(this, guiAction);
}

About.prototype = new Help();

About.prototype.beginEvent = function() {
    Help.prototype.beginEvent.call(this);

    var formWidget = this.createWidget("About.ui");
    formWidget.windowTitle = qsTr("About %1").arg(qApp.applicationName);

    this.head = "<head>\n"
         + "<style type='text/css'>\n"
         + "a { text-decoration:none }\n"
         + "h1 { font-family:sans;font-size:16pt;margin-bottom:8pt; }\n"
         + "h2 { font-family:sans;font-size:12pt;font-style:italic;margin-bottom:5pt; }\n"
         + "body,td { font-family:sans;font-size:9pt; }\n"
         + "}\n</style>\n"
         + "</head>";

    // init about view:
    var webView = formWidget.findChild("QCADText");
    WidgetFactory.initWebView(webView, this, "openUrl");
    this.initAboutQCAD(webView);

    // init plugin view:
    webView = formWidget.findChild("PluginsText");
    WidgetFactory.initWebView(webView, this, "openUrl");
    var webPage = webView.page();
    webPage.linkDelegationPolicy = QWebPage.DelegateAllLinks;
    this.initAboutPlugins(webView);

    // init scripts view:
    webView = formWidget.findChild("ScriptsText");
    WidgetFactory.initWebView(webView, this, "openUrl");
    this.initAboutScripts(webView);

    formWidget.exec();
};

About.prototype.initAboutQCAD = function(webView) {
    var html =
            "<html>"
            + this.head
            + "<body>"
            + "<h1>%1</h1>".arg(qApp.applicationName)
            + "<br/>"
            + "<table border='0'><tr>"
            + "<td><b>Version:</b> </td><td>%1.%2.%3.%4 (%5)</td>"
              .arg(RSettings.getMajorVersion())
              .arg(RSettings.getMinorVersion())
              .arg(RSettings.getRevisionVersion())
              .arg(RSettings.getBuildVersion())
              .arg(RSettings.getVersionString())
            + "</tr><tr>"
            + "<td><b>Build Date:</b> </td><td>%1</td>".arg(RSettings.getReleaseDate())
            + "</tr><tr>"
            + "<td><b>Qt Version:</b> </td><td>%1</td>".arg(RSettings.getQtVersion())
            + "</tr><tr>"
            + "<td><b>Compiler:</b> </td><td>%1</td>".arg(RSettings.getCompilerVersion())
            + "</tr></table>"
            + "<p>%1 is an application for computer-aided design (CAD).</p>".arg(qApp.applicationName)
            + "<p/>"
            + "<p>QCAD is free (open source) software.</p>"
            + "<p>Plugins and script add-ons are subject to their respective license (see 'About Plugins' tab).</p>"
            + "<p/>"
            + "<p>Internet: <a href='http://%1'>%1</a></p>".arg(qApp.organizationDomain)
            + "<p/>"
            + "<p>All brand or product names are trademarks or registered trademarks of their respective holders.</p>"
            + "<p/>"
            + "<p>Portions of this software © 2013 Digia Plc.</p>"
            + "<p>Portions of this software © 2012 Nokia Corporation and/or its subsidiary(-ies).</p>"
            + "<p/>"
            + "</body></html>";
    webView.setHtml(html);
};

About.prototype.initAboutPlugins = function(webView) {
    RPluginLoader.loadPlugins(false);
    var html =
            "<html>"
            + this.head
            + "<body>"
            + "<h1>%1</h1>".arg(qsTr("Plugins"))
            + "<hr/>";

    var numPlugins = RPluginLoader.countPlugins();

    if (numPlugins===0) {
        html += "No plugins found.";
    }
    else {
        for (var i=0; i<numPlugins; i++) {
            html += "<table border='0' width='100%'>";
            html += "<col width='25%'/>";
            html += "<col width='90%'/>";

            var text, url;

             var pluginInfo = RPluginLoader.getPluginInfo(i);

            // plugin about info:
            text = pluginInfo.get("Name", qsTr("No information available"));
            html += this.getTableRow(qsTr("Plugin:"), "<b>" + Qt.escape(text) + "</b>", false);

            // description:
            text = pluginInfo.get("Description");
            if (!isNull(text)) {
                html += this.getTableRow(qsTr("Description:"), text, false);
            }

            // plugin version:
            text = pluginInfo.get("Version", qsTr("Unknown"));
            html += this.getTableRow(qsTr("Version:"), text);

            // Qt plugin version:
            text = pluginInfo.get("QtVersion", qsTr("Unknown"));
            html += this.getTableRow(qsTr("Qt Version:"), text);

            // plugin license:
            text = pluginInfo.get("License", qsTr("Unknown"));
            html += this.getTableRow(qsTr("License:"), text);

            // plugin URL:
            text = pluginInfo.get("URL");
            if (!isNull(text)) {
                url = new QUrl(text);
                if (url.isValid()) {
                    html += this.getTableRow(
                        qsTr("Internet:"),
                        "<a href='%2'>%3</a>"
                            .arg(url.toString()).arg(url.host().replace(/^www./, "")),
                        false
                    );
                }
            }

            // trial:
            var exp = pluginInfo.get("TrialExpired");
            if (!isNull(exp)) {
                var color = "green";
                text = qsTr("Active");
                if (exp) {
                    color = "red";
                    text = qsTr("Inactive (restart)");
                }

                html += this.getTableRow(qsTr("Trial Version:"),
                    "<span style='color:" + color + "'>" + text + "</span>", false);
            }

            // file name:
            text = pluginInfo.get("FileName");
            if (!isNull(text)) {
                var fi = new QFileInfo(text);
                text = fi.fileName();
                url = QUrl.fromLocalFile(fi.absolutePath());
                html += this.getTableRow(qsTr("File:"), "<a href='" + url.toString() + "'>" + text + "</a>", false);
            }

            // plugin error:
            text = pluginInfo.get("Error");
            if (!isNull(text)) {
                html += this.getTableRow(qsTr("Error:"), text);
            }
            html += "</table>";
            html += "<hr/>";
        }
    }

    html += "</body>";
    html += "</html>";
    webView.setHtml(html);
};

About.prototype.initAboutScripts = function(webView) {
    var html =
            "<html>"
            + this.head
            + "<body>"
            + "<h1>%1</h1>".arg(qsTr("Script Add-Ons"))
            + "<hr/>";

    var addOns = AddOn.addOns;
    var numAddOns = addOns.length;

    if (numAddOns===0) {
        html += "No script add-ons found.";
    }
    else {
        var i;
        var scriptsPath = RS.getDirectoryList("scripts")[0];
        var scriptsDir = new QDir(scriptsPath);

        var sorted = new Array();
        for (i=0; i<numAddOns; i++) {
            var addOn = addOns[i];
            var path = addOn.getPath();
            if (path.startsWith(":")) {
                path = path.substring(1);
            }
            else {
                path = scriptsDir.relativeFilePath(path);
            }
            sorted.push([addOn.getClassName(), path]);
        }

        sorted = sorted.sort(function(a,b) { return a[1].localeCompare(b[1]); });

        html += "<table border='0' width='100%'>";
        html += "<col width='25%'/>";
        html += "<col width='90%'/>";

        for (i=0; i<sorted.length; i++) {
            html += "<tr><td>" + sorted[i][0] + "</td><td>" + sorted[i][1] + "</td></tr>"
        }
    }

    html += "</table>";
    html += "</body>";
    html += "</html>";
    webView.setHtml(html);
};



About.prototype.getTableRow = function(text1, text2, escape) {
    if (isNull(escape) || escape!==false) {
        text2 = Qt.escape(text2);
    }

    return "<tr><td valign='top'>%1 </td><td>%2</td></tr>".arg(text1).arg(text2);
};

About.prototype.openUrl = function(url) {
    QDesktopServices.openUrl(url);
};

