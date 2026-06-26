[Type](../../../../README.md) / [Type](../README.md) / getJavaObjectName

# Function: getJavaObjectName()

> **getJavaObjectName**(`obj`): `"GlideDate"` | `"GlideDateTime"` | `"GlideDuration"` | `"GlideSchedule"` | `"GlideSession"` | `"GlideUser"` | `"JavaObject"`

Attempts to identify the specific Glide class an object is an instance of

Most GlideClasses are of type \[object JavaObject]

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `obj` | `JavaObject` | JavaObject, typically a Glide class, to be type checked |

## Returns

`"GlideDate"` | `"GlideDateTime"` | `"GlideDuration"` | `"GlideSchedule"` | `"GlideSession"` | `"GlideUser"` | `"JavaObject"`
