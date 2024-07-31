SystemUtil.CloseProcessByName "saplogon.exe"

SystemUtil.Run "C:\Program Files (x86)\SAP\FrontEnd\SAPgui\saplogon.exe", "", "C:\Program Files (x86)\SAP\FrontEnd\SAPgui"

AIUtil.SetContext Dialog("text:=SAP Logon 770", "is owned window:=False", "is child window:=False")
AIUtil.Table.Cell(1, 0).DoubleClick

counter = 0
Do
	wait 1
	counter = counter + 1
	If counter >= 30 Then
		Reporter.ReportEvent micFail, "SAP Logon Page", "The SAP Logon page didn't show up within " & counter & " tries"
		msgbox "The SAP Logon page didn't show up within " & counter & " tries"
		ExitTest
	End If
Loop Until SAPGuiSession("micclass:=SAPGuiSession").Exist(0)

AIUtil.SetContext SAPGuiSession("micclass:=SAPGuiSession")
AIUtil.Context.Freeze
AIUtil("text_box", "User: *").SetText Parameter("SAP-GUI-Logon-ID")
AIUtil("text_box", "Password: *").SetText Parameter("SAP-GUI-Logon-Password")
AIUtil("text_box", "Password: *").Click
AIUtil.Context.UnFreeze

SAPGuiSession("Session").SAPGuiWindow("SAP").SendKey ENTER @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_

If AIUtil.FindTextBlock("SAP Easy Access", micFromBottom, 1).Exist(0) = FALSE Then
	If AIUtil.FindTextBlock("License Information for Multiple Logons").Exist(0) Then
		AIUtil.FindTextBlock("License Information for Multiple Logons").Click
		AIUtil("radio_button", "Continue with this logon, without ending any other logons in the system").SetState "On"
		AIUtil("check_mark").Click
	Else
		Reporter.ReportEvent micFail, "Logon Process", "The logon process failed"
		msgbox "The logon process failed"
		ExitTest
	End If
End If

AIUtil.FindTextBlock("SAP Easy Access", micFromBottom, 1).CheckExists True
