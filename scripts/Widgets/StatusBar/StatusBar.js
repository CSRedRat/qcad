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

/**
 * The status bar is created and initialized here.
 */
function StatusBar() {
}

StatusBar.getPreferencesCategory = function() {
    return [qsTr("Widgets"), qsTr("Status Bar")];
};

StatusBar.postInit = function(basePath) {
    var appWin = RMainWindowQt.getMainWindow();
    var statusBar = appWin.statusBar();
    statusBar.objectName = "StatusBar";
};

StatusBar.applyPreferences = function(doc, mdiChild) {
    var appWin = RMainWindowQt.getMainWindow();

    var statusBar = appWin.statusBar();
    var w;
    w = statusBar.findChild("Abs");
    w.font = RSettings.getStatusBarFont();
    w = statusBar.findChild("Rel");
    w.font = RSettings.getStatusBarFont();
    w = statusBar.findChild("AbsPol");
    w.font = RSettings.getStatusBarFont();
    w = statusBar.findChild("RelPol");
    w.font = RSettings.getStatusBarFont();

    w = statusBar.findChild("Right");
    w.font = RSettings.getStatusBarFont();
    w = statusBar.findChild("Left");
    w.font = RSettings.getStatusBarFont();

    w = statusBar.findChild("SelectionText");
    w.font = RSettings.getStatusBarFont();
};
