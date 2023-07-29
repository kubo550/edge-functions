<div align="center">
  <a href="https://github.com/kubo550/stack-stats">
     <img src="https://user-images.githubusercontent.com/43968748/168917115-9587fc8f-2648-43da-b10f-39743f78295e.png" alt="stack stats logo" />
  </a>


<h2 align="center">Stack Overflow Stats SVG Generator</h2>

  <p align="center">
     Dynamically generated stack overflow stats for your github readmes
    <br />
  </p>
</div>



## Overview

<!-- HERE YOU GO!  -->

<img src="https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=14513625&withImage=true" alt="stack stats" />&nbsp;
<img src="https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=7856&withImage=true" alt="stack stats" />&nbsp;
<img src="https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=21319038&withImage=true" alt="stack stats" />&nbsp;


## How do I use it?

The only thing you need to do is to add the following code to your page:

```md
![stack stats](https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=<yourId>&withImage=true)
```

Important note: the `id` is the id of the stack you want to display.

In my case, I have a stack with id 14513625.

```md
![stack stats](https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=14513625)
```


Also, you can wrap the above in an anchor tag to make it easier to move on to your stack profile:

```
<a href="https://stackoverflow.com/users/14513625/jakub-kurdziel" target="_blank" rel="noopener noreferrer">
    <img src="https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=14513625" alt="stack stats" />&nbsp;
</a>
```

<a href="https://stackoverflow.com/users/14513625/jakub-kurdziel" target="_blank" rel="noopener noreferrer" title="My Stack Overflow Profile">
    <img src="https://rmynaenogexxzwoqmswd.supabase.co/functions/v1/stack-stats?id=14513625" alt="stack stats" />
</a>




## Tech Stack

* supabase step functions
* deno
* typescript


