{% if not obj.display %}
:orphan:

{% endif %}
:py:mod:`{{ obj.name }}`
{{ "=" * (obj.name|length + 9) }}

.. py:module:: {{ obj.name }}

{% if obj.docstring %}
.. autoapi-nested-parse::

   {{ obj.docstring|indent(3) }}

{% endif %}

{% block subpackages %}
{% set visible_subpackages = obj.subpackages|selectattr("display")|list %}
{% if visible_subpackages %}

Subpackages
-----------

.. toctree::
   :maxdepth: 1

{% for subpackage in visible_subpackages %}
   {{ subpackage.short_name }}/index
{% endfor %}

{% endif %}
{% endblock %}

{% block submodules %}
{% set visible_submodules = obj.submodules|selectattr("display")|list %}
{% if visible_submodules %}

Submodules
----------

.. toctree::
   :maxdepth: 1

{% for submodule in visible_submodules %}
   {{ submodule.short_name }}/index
{% endfor %}

{% endif %}
{% endblock %}

{% block content %}
{% if obj.all is not none %}
{% set visible_children = obj.children|selectattr("short_name", "in", obj.all)|list %}
{% elif obj.type is equalto("package") %}
{% set visible_children = obj.children|selectattr("display")|list %}
{% else %}
{% set visible_children = obj.children|selectattr("display")|rejectattr("imported")|list %}
{% endif %}
{% if visible_children %}

{% set visible_attributes = visible_children|selectattr("type", "equalto", "data")|list %}
{% set visible_exceptions = visible_children|selectattr("type", "equalto", "exception")|list %}
{% set visible_classes = visible_children|selectattr("type", "equalto", "class")|list %}
{% set visible_functions = visible_children|selectattr("type", "equalto", "function")|list %}

{% if visible_attributes %}

Attributes
----------

.. autoapisummary::

{% for attribute in visible_attributes %}
   {{ obj.name }}.{{ attribute.short_name }}
{% endfor %}

{% endif %}

{% if visible_exceptions %}

Exceptions
----------

.. autoapisummary::

{% for exception in visible_exceptions %}
   {{ obj.name }}.{{ exception.short_name }}
{% endfor %}

{% endif %}

{% if visible_classes %}

Classes
-------

.. autoapisummary::

{% for klass in visible_classes %}
   {{ obj.name }}.{{ klass.short_name }}
{% endfor %}

{% endif %}

{% if visible_functions %}

Functions
---------

.. autoapisummary::

{% for function in visible_functions %}
   {{ obj.name }}.{{ function.short_name }}
{% endfor %}

{% endif %}

{% if visible_attributes or visible_exceptions or visible_classes or visible_functions %}

Module Contents
---------------

{% endif %}

{% for obj_item in visible_attributes %}
{{ obj_item.render()|indent(0) }}
{% endfor %}

{% for obj_item in visible_exceptions %}
{{ obj_item.render()|indent(0) }}
{% endfor %}

{% for obj_item in visible_classes %}
{{ obj_item.render()|indent(0) }}
{% endfor %}

{% for obj_item in visible_functions %}
{{ obj_item.render()|indent(0) }}
{% endfor %}

{% endif %}
{% endblock %}
