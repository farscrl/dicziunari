package ch.dicziunari.app;

import android.content.pm.ActivityInfo;
import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // only setting for OS > than Android 8, as the splashscreen causes otherwise a crash:
    // https://github.com/ionic-team/capacitor/issues/1627#issuecomment-652310622
    if(getResources().getBoolean(R.bool.portrait_only) && android.os.Build.VERSION.SDK_INT > Build.VERSION_CODES.O){
      setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
  }
}
