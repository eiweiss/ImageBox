ImageBox
========
A crazy image positioning jQuery plugin

ImageBox is a small and not too serious jQuery plugin that repositions your image galleries thumbnails through generated chaos during every site reload.
Plus, it comes up with a built-in Lightbox, the fabulous Slimbox 2.

# How to use
Put the ImageBox folder in the directory of your page.
Include the script in the header of your page, after the inclusion of the jQuery library.
<pre><code>&lt;script src="ImageBox/imagebox.js"&gt;&lt;/script&gt;</code></pre>
</pre>

# Gallery Markup
<pre><code>&lt;div id="gallery"&gt;
  &lt;a href=&quot;img/image-1.jpg&quot; title=&quot;image-name&quot;&gt;&lt;img src=&quot;img/thumbnail-1.jpg&quot;&gt;&lt;/a&gt;
  &lt;a href=&quot;img/image-2.jpg&quot; title=&quot;image-name&quot;&gt;&lt;img src=&quot;img/thumbnail-2.jpg&quot;&gt;&lt;/a&gt;
  &lt;a href=&quot;img/image-3.jpg&quot; title=&quot;image-name&quot;&gt;&lt;img src=&quot;img/thumbnail-3.jpg&quot;&gt;&lt;/a&gt;
  &lt;a href=&quot;img/image-4.jpg&quot; title=&quot;image-name&quot;&gt;&lt;img src=&quot;img/thumbnail-4.jpg&quot;&gt;&lt;/a&gt;
&lt;/div&gt;</code></pre>

# Initialize
<pre><code>&lt;script&gt;
  $(function(){
    $('#gallery').imagebox();
  });
&lt;/script&gt;</code></pre>

Without configuration of the thumbnail dimensions, the thumbnails are displayed in the plugin default dimension values
<pre><code>&lt;script&gt;
  $(function(){
    $('#gallery').imagebox({
      width: "100px",
      height: "150px"
    });
  });
&lt;/script&gt;</code></pre>
