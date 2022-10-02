var Importer, M, normalizeDate,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

M = require("./mediator");

normalizeDate = function(dateString) {
  var date;
  date = new Date();
  if (dateString) {
    date = new Date(Date.parse(dateString));
  }
  return (date.getFullYear()) + "-" + (date.getMonth() < 9 ? '0' + String(date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
};

module.exports = Importer = (function() {
  Importer.prototype.xml = null;

  Importer.prototype.channel = null;

  function Importer() {
    this.stringify = bind(this.stringify, this);
    this.addAuthor = bind(this.addAuthor, this);
    this.addAttachment = bind(this.addAttachment, this);
    this.addPost = bind(this.addPost, this);
    this.addCategory = bind(this.addCategory, this);
    this.addTag = bind(this.addTag, this);
    this.xml = M.creator().ele("rss").att("xmlns:excerpt", "http://wordpress.org/export/1.2/excerpt/").att("xmlns:content", "http://purl.org/rss/1.0/modules/content/").att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/").att("xmlns:dc", "http://purl.org/dc/elements/1.1/").att("xmlns:wp", "http://wordpress.org/export/1.2/").att("version", "2.0");
    this.channel = this.xml.ele("channel");
    this.channel.ele("wp:wxr_version", {}).txt(1.2);
  }

  Importer.prototype.addAuthor = function(author) {
    var auth;
    auth = this.channel.ele("wp:author");
    auth.ele("wp:author_login", {}).txt(author.login);
    auth.ele("wp:author_email", {}).txt(author.email);
    auth.ele("wp:author_display_name", {}).txt(author.display_name);
    auth.ele("wp:author_first_name", {}).txt(author.first_name);
    auth.ele("wp:author_last_name", {}).txt(author.last_name);
    return auth;
};

  Importer.prototype.addCategory = function(category) {
    var cat, catName, catNameCDATA, catNiceName, termId;
    cat = this.channel.ele("wp:category");
    termId = cat.ele("wp:term_idname", {}).txt(category.id ? category.id : Math.floor(Math.random() * 100000));
    catNiceName = cat.ele("wp:category_nicename", {}).txt(category.slug);
    catName = cat.ele("wp:cat_name");
    return catNameCDATA = catName.dat(category.title);
  };

  Importer.prototype.addTag = function(tag) {
    var tg;
    tg = this.channel.ele("wp:tag");
    tg.ele("wp:term_idname", {}).txt(tag.id ? tag.id : Math.floor(Math.random() * 100000));
    tg.ele("wp:tag_slug", {}).txt(tag.slug);
    tg.ele("wp:tag_name", {}).txt(tag.title);
    return tg;
  };

  Importer.prototype.addPost = function(post) {
    var cat, catCDATA, category, contentEncoded, contentEncodedCDATA, creator, date, id, description, excerptEncoded, excerptEncodedCDATA, i, item, len, name, parent, ref, ref1, results, status, title, type, guid, commentStatus, pingStatus, postName, menuOrder, postPassword, isSticky;
    item = this.channel.ele("item");
    title = item.ele("title", {}).txt(post.title ? post.title : "");
    link = item.ele("link", {}).txt(post.link ? post.link : "");
    creator = item.ele("dc:creator", {}).dat(post.author ? post.author : "admin");
    guid = item.ele("guid", {}).att("isPermaLink", false).txt(post.guid ? post.guid : "");
    description = item.ele("description", {}).txt(post.description ? post.description : "");
    contentEncoded = item.ele("content:encoded");
    contentEncodedCDATA = contentEncoded.dat(post.contentEncoded ? post.contentEncoded : "");
    name = item.ele("wp:post_name", {}).txt(post.name ? post.name : "");
    id = item.ele("wp:post_id", {}).txt(post.id);
    commentStatus = item.ele("wp:comment_status").dat(post.commentStatus ? post.commentStatus : "closed");
    pingStatus = item.ele("wp:ping_status").dat(post.pingStatus ? post.pingStatus : "closed");
    postName = item.ele("wp:post_name").dat(post.postName ? post.postName : "");
    status = item.ele("wp:status", {}).dat(post.status ? post.status : "publish");
    parent = item.ele("wp:post_parent", {}).txt(0);
    menuOrder = item.ele("wp:menu_order", {}).txt(post.menuOrder ? post.menuOrder : 0);
    type = item.ele("wp:post_type", {}).dat("post");
    postPassword = item.ele("wp:post_password", {}).dat(post.password ? post.password : "");
    isSticky = item.ele("wp:is_sticky", {}).txt(post.isSticky ? post.isSticky : 0);
    let postMeta = item.ele("wp:postmeta");
    postMeta.ele("wp:meta_key").dat("_thumbnail_id");
    postMeta.ele("meta_value").dat(post.meta ? post.meta : "");

    if (((ref = post.categories) != null ? ref.length : void 0) > 0) {
      ref1 = post.categories;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        category = ref1[i];
        if (category.slug && category.title) {
          cat = item.ele("category", {
            domain: "category",
            nicename: category.slug
          });
          results.push(catCDATA = cat.dat(category.title));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }

    if (post.date) {
      date = item.ele("wp:post_date", {}).txt(normalizeDate(post.date));
    }
    excerptEncoded = item.ele("excerpt:encoded");
    excerptEncodedCDATA = excerptEncoded.dat(post.excerptEncoded ? post.excerptEncoded : "");

  };

  Importer.prototype.addAttachment = function(options) {
    var creator, date, link, description, contentEncoded, contentEncodedCDATA, excerptEncoded, excerptEncodedCDATA, item, parent, status, title, type, postID, commentStatus, pingStatus, postName, menuOrder, isSticky, attachedFileMeta, attachementImageAltMeta, guid;
    if (options.attachmentURL) {
      item = this.channel.ele("item");
      title = item.ele("title", {}).dat(options.title ? options.title : "Default title for attachment");
      creator = item.ele("dc:creator", {}).dat(options.author ? options.author : "admin");
      if (options.date) {
        date = item.ele("wp:post_date", {}).txt(normalizeDate(options.date));
      }
      link = item.ele("link", {}).txt(options.link ? options.link : "");
      guid = item.ele("guid", {}).att("isPermaLink", false).txt(options.guid ? options.guid : "");
      description = item.ele("description").txt(options.description ? options.description : "");
      contentEncoded = item.ele("content:encoded");
      contentEncodedCDATA = contentEncoded.dat(options.contentEncoded ? options.contentEncoded : "");
      excerptEncoded = item.ele("excerpt:encoded");
      excerptEncodedCDATA = excerptEncoded.dat(options.excerptEncoded ? options.excerptEncoded : "");
      postID = item.ele("wp:post_id", {}).txt(options.postID ? options.postID : 0);
      commentStatus = item.ele("wp:comment_status").dat(options.commentStatus ? options.commentStatus : "closed");
      pingStatus = item.ele("wp:ping_status").dat(options.pingStatus ? options.pingStatus : "closed");
      postName = item.ele("wp:post_name").dat(options.postName ? options.postName : "");
      status = item.ele("wp:status", {}).dat(options.status ? options.status : "inherit");
      menuOrder = item.ele("wp:menu_order", {}).txt(options.menuOrder ? options.menuOrder : 0);
      isSticky = item.ele("wp:is_sticky", {}).txt(options.isSticky ? options.isSticky : 0);
      parent = item.ele("wp:post_parent", {}).txt(options.parent ? options.parent : 0);
      let postMetaAttachedFile = item.ele("wp:postmeta");
      postMetaAttachedFile.ele("wp:meta_key").dat("_wp_attached_file");
      postMetaAttachedFile.ele("meta_value").dat(options.attachedFileMeta ? options.attachedFileMeta : "");
      attachedFileMeta = postMetaAttachedFile;
      let postMetaAttachmentImage = item.ele("wp:postmeta");
      postMetaAttachmentImage.ele("wp:meta_key").dat("_wp_attachment_image_alt");
      postMetaAttachmentImage.ele("wp:meta_value").dat(options.attachementImageAltMeta ? options.attachementImageAltMeta : "");
      attachementImageAltMeta = postMetaAttachmentImage;
      type = item.ele("wp:post_type", {}).dat("attachment");
      return type = item.ele("wp:attachment_url", {}).dat(options.attachmentURL ? options.attachmentURL : "");
    }
  };

  Importer.prototype.stringify = function() {
    return this.xml.end({
      prettyPrint: true,
      indent: "    ",
      newline: "\n",
      format: "xml"
    });
  };

  return Importer;

})();
